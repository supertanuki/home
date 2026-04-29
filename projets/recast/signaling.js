// Signaling: PeerJS with manual SDP fallback
// PeerJS is tried first (5s timeout). On failure, falls back to raw WebRTC + copy-paste.

const PEERJS_TIMEOUT_MS = 5000;
const PEERJS_CDN = 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.Peer) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ─── PeerJS mode ────────────────────────────────────────────────────────────

class PeerJSSignaling {
  constructor() {
    this.peer = null;
    this.connections = {}; // peerId → DataConnection
    this.onDataChannel = null;  // callback(conn, peerId)
    this.onRemoteStream = null; // callback(peerId, MediaStream)
    this._localStream = null;
    this._audioCalls = {};      // peerId → MediaConnection (outgoing only)
  }

  async init() {
    await loadScript(PEERJS_CDN);
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('PeerJS timeout'));
      }, PEERJS_TIMEOUT_MS);

      this.peer = new Peer({ debug: 0 });
      this.peer.on('open', (id) => {
        clearTimeout(timeout);
        this.myId = id;
        resolve(id);
      });
      this.peer.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
      this.peer.on('connection', (conn) => {
        this._setupConn(conn);
      });
      // Auto-answer any incoming audio calls
      this.peer.on('call', (call) => {
        if (this._localStream) call.answer(this._localStream);
        call.on('stream', (remoteStream) => {
          if (this.onRemoteStream) this.onRemoteStream(call.peer, remoteStream);
        });
      });
    });
  }

  // Set the local audio stream and enable audio answering
  setupAudio(localStream) {
    this._localStream = localStream;
  }

  // Initiate an outgoing audio call to a peer
  callPeer(remotePeerId) {
    if (!this._localStream || this._audioCalls[remotePeerId]) return;
    const call = this.peer.call(remotePeerId, this._localStream);
    if (!call) return;
    this._audioCalls[remotePeerId] = call;
    call.on('stream', (remoteStream) => {
      if (this.onRemoteStream) this.onRemoteStream(remotePeerId, remoteStream);
    });
  }

  connect(remotePeerId) {
    const conn = this.peer.connect(remotePeerId, { reliable: true });
    this._setupConn(conn);
    return conn;
  }

  _setupConn(conn) {
    conn.on('open', () => {
      this.connections[conn.peer] = conn;
      if (this.onDataChannel) this.onDataChannel(conn, conn.peer);
    });
  }

  send(peerId, data) {
    const conn = this.connections[peerId];
    if (conn) conn.send(data);
  }

  broadcast(data) {
    Object.values(this.connections).forEach(c => c.send(data));
  }

  destroy() {
    if (this.peer) this.peer.destroy();
  }
}

// ─── Manual WebRTC mode ──────────────────────────────────────────────────────

class ManualSignaling {
  constructor() {
    this.connections = {}; // label → { pc, channel }
    this.onDataChannel = null;
    this.myId = 'manual-' + Math.random().toString(36).slice(2, 8);
  }

  _iceConfig() {
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };
  }

  async createOffer(label) {
    const pc = new RTCPeerConnection(this._iceConfig());
    const channel = pc.createDataChannel('data', { ordered: true });
    this._setupChannel(channel, label);
    this.connections[label] = { pc, channel: null };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Wait for ICE gathering to complete
    await this._waitICE(pc);

    // Store channel once open
    channel.onopen = () => {
      this.connections[label].channel = channel;
      if (this.onDataChannel) this.onDataChannel({ send: d => channel.send(d) }, label);
    };

    return JSON.stringify(pc.localDescription);
  }

  async acceptOffer(offerStr, label) {
    const offerDesc = JSON.parse(offerStr);
    const pc = new RTCPeerConnection(this._iceConfig());

    pc.ondatachannel = (e) => {
      const channel = e.channel;
      this._setupChannel(channel, label);
      channel.onopen = () => {
        this.connections[label].channel = channel;
        if (this.onDataChannel) this.onDataChannel({ send: d => channel.send(d) }, label);
      };
    };

    this.connections[label] = { pc, channel: null };

    await pc.setRemoteDescription(new RTCSessionDescription(offerDesc));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await this._waitICE(pc);

    return JSON.stringify(pc.localDescription);
  }

  async acceptAnswer(answerStr, label) {
    const answerDesc = JSON.parse(answerStr);
    const { pc } = this.connections[label];
    await pc.setRemoteDescription(new RTCSessionDescription(answerDesc));
  }

  _waitICE(pc) {
    return new Promise((resolve) => {
      if (pc.iceGatheringState === 'complete') { resolve(); return; }
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') resolve();
      };
      // Safety timeout
      setTimeout(resolve, 8000);
    });
  }

  _setupChannel(channel, label) {
    channel.onmessage = (e) => {
      const entry = this.connections[label];
      if (entry && entry.onmessage) entry.onmessage(e.data);
    };
  }

  send(label, data) {
    const entry = this.connections[label];
    if (entry && entry.channel) entry.channel.send(data);
  }

  broadcast(data) {
    Object.values(this.connections).forEach(({ channel }) => {
      if (channel && channel.readyState === 'open') channel.send(data);
    });
  }

  destroy() {
    Object.values(this.connections).forEach(({ pc }) => pc.close());
  }
}

// ─── Factory: try PeerJS, fall back to Manual ────────────────────────────────

async function createSignaling(onFallback) {
  try {
    const sig = new PeerJSSignaling();
    await sig.init();
    return { signaling: sig, mode: 'peerjs' };
  } catch (e) {
    console.warn('PeerJS unavailable, switching to manual mode:', e.message);
    if (onFallback) onFallback();
    const sig = new ManualSignaling();
    return { signaling: sig, mode: 'manual' };
  }
}

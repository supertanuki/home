// ─── State ───────────────────────────────────────────────────────────────────

const state = {
  name: '',
  role: null,          // 'host' | 'guest'
  sigMode: null,       // 'peerjs' | 'manual'
  signaling: null,
  myPeerId: null,
  hostPeerId: null,    // guest only
  peers: {},           // peerId → { name, conn }
  recorder: new AudioRecorder(),
  fileReceiver: new FileReceiver(),
  tracks: [],          // { blob, name, size, from }
  isRecording: false,
  recTimerInterval: null,
  manualGuestCount: 0,
  transferPending: false,
};

// ─── Screen navigation ───────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── Recordings library (welcome screen) ─────────────────────────────────────

async function loadRecordingsUI() {
  const list = await RecordingStorage.list();
  const container = document.getElementById('recordings-list');
  const countEl   = document.getElementById('recordings-count');

  if (!list.length) {
    container.innerHTML = '<p class="recordings-empty">Aucun enregistrement sauvegardé dans ce navigateur.</p>';
    countEl.classList.add('hidden');
    return;
  }

  countEl.textContent = `${list.length} fichier${list.length > 1 ? 's' : ''}`;
  countEl.classList.remove('hidden');

  // Sort: most recent first
  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  const rows = list.map(rec => {
    const mb   = (rec.size / 1024 / 1024).toFixed(1);
    const date = new Date(rec.date).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    return `
      <tr id="rec-item-${rec.id}">
        <td class="rec-col-name">${escapeHtml(rec.name)}</td>
        <td class="rec-col-date">${date}</td>
        <td class="rec-col-size">${mb} Mo</td>
        <td class="rec-col-actions">
          <button class="btn btn-ghost btn-sm" onclick="downloadStoredRecording(${rec.id})">⬇ Télécharger</button>
          <button class="btn btn-ghost btn-sm btn-delete" id="del-btn-${rec.id}"
                  onclick="confirmDeleteRecording(${rec.id})">Supprimer</button>
        </td>
      </tr>`;
  }).join('');

  container.innerHTML = `
    <table class="rec-table">
      <thead>
        <tr>
          <th>Fichier</th>
          <th>Date</th>
          <th>Taille</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

async function downloadStoredRecording(id) {
  const list = await RecordingStorage.list();
  const rec  = list.find(r => r.id === id);
  if (rec) downloadBlob(rec.blob, rec.name);
}

function confirmDeleteRecording(id) {
  const btn = document.getElementById(`del-btn-${id}`);
  if (!btn) return;
  // Hide the download button in the same row
  const row = document.getElementById(`rec-item-${id}`);
  const dlBtn = row?.querySelector('.btn:not(.btn-delete)');
  if (dlBtn) dlBtn.style.display = 'none';
  // Replace button with inline confirm/cancel
  btn.outerHTML = `
    <span class="delete-confirm">
      Supprimer ?
      <button class="btn btn-danger btn-sm" onclick="doDeleteRecording(${id})">Oui</button>
      <button class="btn btn-ghost btn-sm" onclick="loadRecordingsUI()">Non</button>
    </span>`;
}

async function doDeleteRecording(id) {
  await RecordingStorage.delete(id);
  loadRecordingsUI();
}

async function saveRecordingToDB(blob, name) {
  try {
    await RecordingStorage.save(blob, name);
  } catch (e) {
    console.warn('Impossible de sauvegarder dans IndexedDB :', e);
  }
}

// ─── Welcome screen ──────────────────────────────────────────────────────────

function selectRole(role) {
  state.role = role;
  document.getElementById('role-host').classList.toggle('selected', role === 'host');
  document.getElementById('role-guest').classList.toggle('selected', role === 'guest');
  updateContinueBtn();
}

document.getElementById('input-name').addEventListener('input', updateContinueBtn);
loadRecordingsUI();

// ─── URL-based guest detection ────────────────────────────────────────────────

{
  const urlHostId = new URLSearchParams(location.search).get('h');
  if (urlHostId) {
    state.role       = 'guest';
    state.hostPeerId = urlHostId;
    document.getElementById('role-grid').classList.add('hidden');
    document.getElementById('guest-join-notice').classList.remove('hidden');
    document.getElementById('role-heading').textContent = 'Rejoindre la session';
  }
}

function updateContinueBtn() {
  const name = document.getElementById('input-name').value.trim();
  document.getElementById('btn-continue').disabled = !(name && state.role);
}

async function goToSetup() {
  state.name = document.getElementById('input-name').value.trim();

  const ok = await state.recorder.requestPermission();
  if (!ok) {
    alert('Accès au microphone requis pour enregistrer. Veuillez autoriser dans votre navigateur.');
    return;
  }

  const { signaling, mode } = await createSignaling(null);
  state.signaling = signaling;
  state.sigMode   = mode;
  state.myPeerId  = signaling.myId;
  signaling.onDataChannel = (conn, peerId) => setupPeerConnection(conn, peerId);
  addSelfToParticipants();

  if (mode === 'peerjs') {
    // Wire audio: auto-answer incoming calls + play remote streams
    signaling.setupAudio(state.recorder.stream);
    signaling.onRemoteStream = (peerId, stream) => playRemoteAudio(peerId, stream);
    setupFileReceiver();

    if (state.role === 'host') {
      const shareUrl = `${location.origin}${location.pathname}?h=${state.myPeerId}`;
      window.history.replaceState({}, '', `?h=${state.myPeerId}`);
      document.getElementById('share-link-card').classList.remove('hidden');
      document.getElementById('share-link-input').value = shareUrl;
      showScreen('screen-studio');
    } else {
      // DataConnection: let onDataChannel handle setupPeerConnection (avoids double-registration)
      state.signaling.connect(state.hostPeerId);
      // Audio call to host (host auto-answers, bidirectional stream established)
      state.signaling.callPeer(state.hostPeerId);
      showScreen('screen-studio');
      document.getElementById('btn-record').classList.add('hidden');
      document.getElementById('rec-info').textContent =
        'L\'animateur démarrera l\'enregistrement pour tout le monde.';
    }
  } else {
    // Manual mode: existing SDP setup screens
    const fallbackMsg = '⚠️ PeerJS indisponible — mode manuel activé';
    if (state.role === 'host') {
      showScreen('screen-host-setup');
      const s = document.getElementById('peerjs-status');
      s.textContent = fallbackMsg; s.className = 'alert alert-warning';
      document.getElementById('manual-host-panel').classList.remove('hidden');
      addGuestSlot();
      document.getElementById('btn-go-studio').disabled = false;
    } else {
      showScreen('screen-guest-setup');
      const s = document.getElementById('peerjs-status-guest');
      s.textContent = fallbackMsg; s.className = 'alert alert-warning';
      document.getElementById('manual-guest-panel').classList.remove('hidden');
      setupManualGuestSteps();
    }
  }
}

// ─── Message protocol ────────────────────────────────────────────────────────

// Message types sent over data channel:
// { type: 'hello', name }            — first message after connect
// { type: 'chat', from, text }       — chat message
// { type: 'cmd', cmd }               — 'start-recording' | 'stop-recording' | 'start-transfer'
// { type: 'participants', list }     — host broadcasts full participant list
// { type: 'file-header', ... }       — from transfer.js
// { type: 'file-end', ... }          — from transfer.js
// binary ArrayBuffer                  — file chunk from transfer.js

function setupPeerConnection(conn, peerId) {
  // For PeerJS, conn is a DataConnection; for manual, conn is { send }
  // We normalise to a wrapper
  state.peers[peerId] = { name: '…', conn };

  const handleMsg = (rawData) => {
    // Try file transfer first (handles binary and file- messages)
    const isFile = state.fileReceiver.handleMessage(rawData, peerId);
    if (isFile) return;

    let msg;
    try { msg = typeof rawData === 'string' ? JSON.parse(rawData) : null; }
    catch { return; }
    if (!msg) return;

    switch (msg.type) {
      case 'hello':
        state.peers[peerId].name = msg.name;
        updateBadge(peerId, 'connected');
        refreshParticipantsUI();
        if (state.role === 'host') broadcastParticipants();
        break;

      case 'chat':
        appendChat(msg.from, msg.text);
        if (state.role === 'host') relayToOthers(peerId, rawData);
        break;

      case 'cmd':
        handleCmd(msg.cmd, peerId);
        break;

      case 'participants':
        renderGuestParticipants(msg.list);
        // Call any new peer for audio (guest-to-guest, each side calls only peers with larger ID)
        if (state.sigMode === 'peerjs' && msg.list) {
          msg.list.forEach(p => {
            if (p.peerId && p.peerId !== state.myPeerId && p.peerId > state.myPeerId) {
              state.signaling.callPeer(p.peerId);
            }
          });
        }
        break;
    }
  };

  // PeerJS DataConnection uses .on('data') / Manual uses conn.onmessage
  if (conn.on) {
    conn.on('data', handleMsg);
    conn.on('open', () => sendHello(peerId));
    conn.on('close', () => handleDisconnect(peerId));
    conn.on('error', () => handleDisconnect(peerId));
  } else {
    // Manual mode: channel is already wired; wire message handler
    const entry = state.signaling.connections[peerId];
    if (entry) entry.onmessage = handleMsg;
    // For manual, connection open is handled in ManualSignaling._setupChannel
    sendHello(peerId);
  }
}

function sendHello(peerId) {
  send(peerId, { type: 'hello', name: state.name });
}

function send(peerId, data) {
  const raw = typeof data === 'string' ? data : JSON.stringify(data);
  if (state.sigMode === 'peerjs') {
    const peer = state.peers[peerId];
    if (peer && peer.conn) peer.conn.send(raw);
  } else {
    state.signaling.send(peerId, raw);
  }
}

function broadcast(data) {
  const raw = typeof data === 'string' ? data : JSON.stringify(data);
  if (state.sigMode === 'peerjs') {
    Object.keys(state.peers).forEach(pid => send(pid, raw));
  } else {
    state.signaling.broadcast(raw);
  }
}

function relayToOthers(fromPeerId, raw) {
  Object.keys(state.peers).forEach(pid => {
    if (pid !== fromPeerId) send(pid, raw);
  });
}

function handleDisconnect(peerId) {
  const peer = state.peers[peerId];
  if (peer) {
    appendSystemMsg(`${peer.name} s'est déconnecté`);
    delete state.peers[peerId];
    refreshParticipantsUI();
    if (state.role === 'host') broadcastParticipants();
  }
}

function handleCmd(cmd, fromPeerId) {
  if (cmd === 'start-recording') startRecordingLocal();
  if (cmd === 'stop-recording')  stopRecordingLocal();
  if (cmd === 'start-transfer')  startTransferAsGuest();
}

// ─── Host UI ─────────────────────────────────────────────────────────────────

function copyShareLink() {
  const input = document.getElementById('share-link-input');
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = input.nextElementSibling;
    const t = btn.textContent;
    btn.textContent = 'Copié !';
    setTimeout(() => btn.textContent = t, 1500);
  });
}

// Manual mode: slot for each guest (host generates offer, waits for answer)
let guestSlotIndex = 0;
function addGuestSlot() {
  const idx = guestSlotIndex++;
  const label = `guest-${idx}`;
  const container = document.getElementById('manual-guest-slots');

  const div = document.createElement('div');
  div.id = `slot-${label}`;
  div.className = 'sdp-steps';
  div.style.marginBottom = '24px';
  div.innerHTML = `
    <div style="font-weight:600;margin-bottom:8px">Invité ${idx + 1}</div>
    <div class="sdp-step">
      <div class="sdp-step-label"><span class="step-num">1</span> Copiez ce texte et envoyez-le à l'invité :</div>
      <div class="copy-row">
        <textarea id="offer-${label}" readonly placeholder="Génération en cours…"></textarea>
        <button class="btn btn-ghost" onclick="copyText('offer-${label}')">Copier</button>
      </div>
    </div>
    <div class="sdp-step">
      <div class="sdp-step-label"><span class="step-num">2</span> Collez ici la réponse de l'invité :</div>
      <div class="copy-row">
        <textarea id="answer-${label}" placeholder="Collez la réponse ici…"></textarea>
        <button class="btn btn-primary" onclick="hostAcceptAnswer('${label}')">Valider</button>
      </div>
    </div>
  `;
  container.appendChild(div);

  // Generate offer for this slot
  state.signaling.createOffer(label).then(offerStr => {
    document.getElementById(`offer-${label}`).value = offerStr;
  });
}

async function hostAcceptAnswer(label) {
  const answerStr = document.getElementById(`answer-${label}`).value.trim();
  if (!answerStr) { alert('Collez d\'abord la réponse de l\'invité.'); return; }
  try {
    await state.signaling.acceptAnswer(answerStr, label);
    document.getElementById(`slot-${label}`).innerHTML +=
      '<div class="alert alert-success mt-8">✓ Invité connecté</div>';
    // Connection will trigger onDataChannel → setupPeerConnection
  } catch (e) {
    alert('Réponse invalide : ' + e.message);
  }
}

// ─── Guest UI ────────────────────────────────────────────────────────────────

function setupManualGuestSteps() {
  const container = document.getElementById('manual-guest-steps');
  container.innerHTML = `
    <div class="sdp-step">
      <div class="sdp-step-label"><span class="step-num">1</span> Copiez ce texte et envoyez-le à l'animateur :</div>
      <div class="copy-row">
        <textarea id="guest-offer" readonly placeholder="Génération en cours (5-8 secondes)…"></textarea>
        <button class="btn btn-ghost" onclick="copyText('guest-offer')">Copier</button>
      </div>
    </div>
    <div class="sdp-step">
      <div class="sdp-step-label"><span class="step-num">2</span> Collez ici la réponse de l'animateur :</div>
      <div class="copy-row">
        <textarea id="guest-answer" placeholder="Collez la réponse ici…"></textarea>
        <button class="btn btn-primary" onclick="guestAcceptAnswer()">Valider</button>
      </div>
    </div>
  `;

  const hostLabel = 'host';
  state.hostPeerId = hostLabel;
  state.signaling.createOffer(hostLabel).then(offerStr => {
    document.getElementById('guest-offer').value = offerStr;
  });
}

async function guestAcceptAnswer() {
  const answerStr = document.getElementById('guest-answer').value.trim();
  if (!answerStr) { alert('Collez d\'abord la réponse de l\'animateur.'); return; }
  try {
    await state.signaling.acceptAnswer(answerStr, state.hostPeerId);
    document.getElementById('guest-waiting-panel').classList.remove('hidden');
    addSelfToParticipants();

    // Wire message handler for manual mode
    const entry = state.signaling.connections[state.hostPeerId];
    if (entry) {
      entry.onmessage = (rawData) => {
        const isFile = state.fileReceiver.handleMessage(rawData, state.hostPeerId);
        if (isFile) return;
        let msg;
        try { msg = JSON.parse(rawData); } catch { return; }
        switch (msg.type) {
          case 'hello':
            state.peers[state.hostPeerId] = { name: msg.name, conn: null };
            renderGuestParticipants([{ name: state.name }, { name: msg.name }]);
            break;
          case 'chat': appendChat(msg.from, msg.text); break;
          case 'cmd':  handleCmd(msg.cmd); break;
          case 'participants': renderGuestParticipants(msg.list); break;
        }
      };
      sendHello(state.hostPeerId);
    }
  } catch (e) {
    alert('Réponse invalide : ' + e.message);
  }
}

// ─── Participants UI ─────────────────────────────────────────────────────────

function addSelfToParticipants() {
  state.peers['__self__'] = { name: state.name, conn: null };
  refreshParticipantsUI();
}

function refreshParticipantsUI() {
  const list = buildParticipantEntries();
  ['participants-list', 'studio-participants'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = list;
  });
}

function renderGuestParticipants(list) {
  const html = list.map(p => participantHTML(p.name, 'connected')).join('');
  ['guest-participants-list', 'studio-participants'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

function buildParticipantEntries() {
  return Object.values(state.peers).map(p =>
    participantHTML(p.name, p.conn === null ? 'connected' : 'connected')
  ).join('');
}

function participantHTML(name, status) {
  const initials = name.slice(0, 2).toUpperCase();
  const label = status === 'recording' ? 'enregistre' : status === 'waiting' ? 'en attente' : 'connecté';
  return `
    <div class="participant">
      <div class="avatar">${initials}</div>
      <div class="name">${escapeHtml(name)}</div>
      <div class="status status-${status}">${label}</div>
    </div>`;
}

function updateBadge(peerId, status) {
  if (state.peers[peerId]) state.peers[peerId].status = status;
  document.getElementById('connection-badge').textContent =
    Object.keys(state.peers).length > 1 ? 'connecté' : 'en attente';
}

function broadcastParticipants() {
  const list = Object.entries(state.peers)
    .filter(([pid]) => pid !== '__self__')
    .map(([pid, p]) => ({ name: p.name, peerId: pid }));
  list.push({ name: state.name, peerId: state.myPeerId });
  broadcast({ type: 'participants', list });
}

// ─── Studio ──────────────────────────────────────────────────────────────────

function goToStudio() {
  showScreen('screen-studio');
  refreshParticipantsUI();
  setupFileReceiver();

  // Guests: guest is not host, buttons hidden
  if (state.role !== 'host') {
    document.getElementById('btn-record').classList.add('hidden');
    document.getElementById('rec-info').textContent =
      'L\'animateur démarrera l\'enregistrement pour tout le monde.';
  }
}

// ─── Recording ───────────────────────────────────────────────────────────────

async function toggleRecording() {
  if (!state.isRecording) {
    broadcast({ type: 'cmd', cmd: 'start-recording' });
    startRecordingLocal();
  } else {
    broadcast({ type: 'cmd', cmd: 'stop-recording' });
    await stopRecordingLocal();
  }
}

function startRecordingLocal() {
  state.recorder.start();
  state.isRecording = true;
  document.getElementById('rec-dot').classList.add('active');
  const btnRec1 = document.getElementById('btn-record');
  btnRec1.textContent = '⏹ Arrêter';
  btnRec1.classList.replace('btn-danger', 'btn-ghost');
  document.getElementById('rec-info').classList.add('hidden');
  startRecTimer();
  appendSystemMsg('Enregistrement démarré');
}

async function stopRecordingLocal() {
  const blob = await state.recorder.stop();
  state.isRecording = false;
  document.getElementById('rec-dot').classList.remove('active');
  const btnRec2 = document.getElementById('btn-record');
  btnRec2.textContent = '⏺ Démarrer';
  btnRec2.classList.replace('btn-ghost', 'btn-danger');
  stopRecTimer();
  appendSystemMsg('Enregistrement terminé');

  if (blob) {
    const ext = blob.type.includes('ogg') ? 'ogg' : 'webm';
    const filename = `${state.name}_${timestamp()}.${ext}`;
    state.tracks.push({ blob, name: filename, size: blob.size, from: state.name });
    saveRecordingToDB(blob, filename);

    // Show tracks section in studio, own track is immediately available
    showStudioTracksSection();
    addStudioTrackRow(state.name, filename, 'received', blob);

    if (state.role === 'host') {
      // Add pending rows for each connected guest
      Object.values(state.peers).forEach(p => {
        if (p.name !== state.name && p.name !== '…') {
          addStudioTrackRow(p.name, null, 'pending', null);
        }
      });
      broadcast({ type: 'cmd', cmd: 'start-transfer' });
    } else {
      // If 'start-transfer' already arrived before blob was ready, send now
      if (state.transferPending) {
        state.transferPending = false;
        sendTrackToHost(blob, filename);
      }
    }
  }
}

// ─── Timer ───────────────────────────────────────────────────────────────────

function startRecTimer() {
  state.recTimerInterval = setInterval(() => {
    const s = state.recorder.getElapsedSeconds();
    document.getElementById('rec-timer').textContent = formatTime(s);
  }, 1000);
}

function stopRecTimer() {
  clearInterval(state.recTimerInterval);
}

function formatTime(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${ss}`;
}

// ─── Transfer ────────────────────────────────────────────────────────────────

function setupFileReceiver() {
  state.fileReceiver.onFileComplete = (blob, meta, fromLabel) => {
    const peerName = state.peers[fromLabel]?.name ?? fromLabel;
    state.tracks.push({ blob, name: meta.name, size: blob.size, from: peerName });
    saveRecordingToDB(blob, meta.name);
    updateStudioTrackRow(peerName, 'received', blob, 100);
  };
  state.fileReceiver.onProgress = (_name, pct, fromLabel) => {
    const peerName = state.peers[fromLabel]?.name ?? fromLabel;
    updateStudioTrackRow(peerName, 'receiving', null, pct);
  };
}

function setupTransferUI() {
  const list = document.getElementById('transfer-list');
  list.innerHTML = '';
  // Add placeholder rows for each connected peer
  Object.values(state.peers).forEach(p => {
    if (p.name === state.name || p.name === '…') return;
    const ext = 'webm';
    const filename = `${p.name}_*.${ext}`;
    addTransferRow(filename, p.name);
  });
}

function setupGuestTransferUI(blob, filename) {
  // Guest sends own blob to host
  const hostPeerId = state.hostPeerId;
  if (!hostPeerId) return;

  const progressEl = createProgressEl(filename, 'Envoi…');
  document.getElementById('transfer-list').appendChild(progressEl);

  // Get the connection wrapper
  let connWrapper;
  if (state.sigMode === 'peerjs') {
    const peer = state.peers[hostPeerId];
    if (peer && peer.conn) connWrapper = peer.conn;
  } else {
    const entry = state.signaling.connections[hostPeerId];
    if (entry && entry.channel) connWrapper = { send: d => entry.channel.send(d) };
  }

  if (!connWrapper) {
    appendSystemMsg('Impossible d\'envoyer : connexion perdue.');
    return;
  }

  sendFile(connWrapper, blob, { name: filename, mimeType: blob.type }, (pct) => {
    updateProgress(progressEl, pct);
  });
}

function startTransferAsGuest() {
  if (state.tracks.length > 0) {
    const track = state.tracks[0];
    sendTrackToHost(track.blob, track.name);
  } else {
    // Blob not ready yet (stopRecordingLocal still running) — flag it
    state.transferPending = true;
  }
}

function sendTrackToHost(blob, filename) {
  const hostPeerId = state.hostPeerId;
  if (!hostPeerId) return;

  let connWrapper;
  if (state.sigMode === 'peerjs') {
    const peer = state.peers[hostPeerId];
    if (peer && peer.conn) connWrapper = peer.conn;
  } else {
    const entry = state.signaling.connections[hostPeerId];
    if (entry && entry.channel) connWrapper = { send: d => entry.channel.send(d) };
  }

  if (!connWrapper) {
    appendSystemMsg('Impossible d\'envoyer : connexion perdue.');
    return;
  }

  appendSystemMsg('Envoi de votre piste en cours…');
  sendFile(connWrapper, blob, { name: filename, mimeType: blob.type }, (pct) => {
    if (pct === 100) appendSystemMsg('Piste envoyée à l\'animateur ✓');
  });
}

// ─── Studio tracks section ───────────────────────────────────────────────────

function showStudioTracksSection() {
  document.getElementById('studio-tracks-card').classList.remove('hidden');
}

function addStudioTrackRow(participantName, _filename, status, blob) {
  const id = 'studio-track-' + safeDomId(participantName);
  if (document.getElementById(id)) {
    updateStudioTrackRow(participantName, status, blob, 0);
    return;
  }
  const container = document.getElementById('studio-tracks-list');
  const div = document.createElement('div');
  div.className = 'studio-track';
  div.id = id;
  container.appendChild(div);
  renderStudioTrackRow(div, participantName, status, blob, 0);
}

function updateStudioTrackRow(participantName, status, blob, pct) {
  const id = 'studio-track-' + safeDomId(participantName);
  const div = document.getElementById(id);
  if (!div) {
    // Row doesn't exist yet (race: progress arrived before addStudioTrackRow)
    addStudioTrackRow(participantName, null, status, blob);
    return;
  }
  renderStudioTrackRow(div, participantName, status, blob, pct);
}

function renderStudioTrackRow(div, participantName, status, _blob, pct) {
  const isMe = participantName === state.name;
  const label = isMe ? `${escapeHtml(participantName)} (vous)` : escapeHtml(participantName);

  let badge, actions = '';
  if (status === 'received') {
    badge = '<span class="track-badge track-badge-received">reçu</span>';
    const track = state.tracks.find(t => t.from === participantName);
    if (track) {
      const mb = (track.size / 1024 / 1024).toFixed(1);
      actions = `
        <span class="track-size-label">${mb} Mo</span>
        <button class="btn btn-ghost btn-sm" onclick="downloadStudioTrack('${escapeHtml(participantName)}')">⬇</button>`;
    }
  } else if (status === 'receiving') {
    badge = `<span class="track-badge track-badge-receiving">en cours… ${pct}%</span>`;
  } else {
    badge = '<span class="track-badge track-badge-pending">non reçu</span>';
  }

  div.innerHTML = `
    <div class="studio-track-info">
      <span class="studio-track-name">${label}</span>
      ${badge}
    </div>
    <div class="studio-track-actions">${actions}</div>`;
}

function downloadStudioTrack(participantName) {
  const track = state.tracks.find(t => t.from === participantName);
  if (track) downloadBlob(track.blob, track.name);
}

function safeDomId(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '_');
}

function playRemoteAudio(peerId, stream) {
  const id = 'remote-audio-' + safeDomId(peerId);
  let audio = document.getElementById(id);
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = id;
    audio.autoplay = true;
    document.body.appendChild(audio);
  }
  audio.srcObject = stream;
}

function addTransferRow(filename, fromName) {
  const el = createProgressEl(filename, `En attente de ${fromName}…`);
  el.id = `progress-${filename}`;
  document.getElementById('transfer-list').appendChild(el);
}

function createProgressEl(filename, label) {
  const div = document.createElement('div');
  div.className = 'progress-wrap';
  div.id = `progress-${filename}`;
  div.innerHTML = `
    <div class="progress-label">
      <span>${escapeHtml(filename)}</span>
      <span class="pct-label">${label}</span>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" style="width:0%"></div>
    </div>`;
  return div;
}

function updateTransferProgress(filename, pct) {
  const el = document.getElementById(`progress-${filename}`);
  if (!el) return;
  el.querySelector('.progress-bar-fill').style.width = pct + '%';
  el.querySelector('.pct-label').textContent = pct < 100 ? pct + '%' : 'Reçu ✓';
}

function updateProgress(el, pct) {
  el.querySelector('.progress-bar-fill').style.width = pct + '%';
  el.querySelector('.pct-label').textContent = pct < 100 ? pct + '%' : 'Envoyé ✓';
}

function addTrackToUI(track) {
  const panel = document.getElementById('transfer-done-panel');
  panel.classList.remove('hidden');
  const list = document.getElementById('tracks-list');
  const mb = (track.size / 1024 / 1024).toFixed(1);
  const div = document.createElement('div');
  div.className = 'track-item';
  div.innerHTML = `
    <div class="track-name">🎙 ${escapeHtml(track.name)}</div>
    <div class="track-size">${mb} Mo</div>
    <button class="btn btn-ghost" onclick="downloadTrack('${track.name}')">⬇ Télécharger</button>`;
  list.appendChild(div);
}

function downloadAll() {
  state.tracks.forEach(t => downloadBlob(t.blob, t.name));
}

function downloadTrack(name) {
  const track = state.tracks.find(t => t.name === name);
  if (track) downloadBlob(track.blob, name);
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Chat ────────────────────────────────────────────────────────────────────

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendChat(state.name, text);
  broadcast({ type: 'chat', from: state.name, text });
}

function appendChat(from, text) {
  const el = document.getElementById('chat-messages');
  if (!el) return;
  const div = document.createElement('div');
  div.className = 'chat-msg';
  div.innerHTML = `<span class="from">${escapeHtml(from)}</span>${escapeHtml(text)}`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function appendSystemMsg(text) {
  const el = document.getElementById('chat-messages');
  if (!el) return;
  const div = document.createElement('div');
  div.className = 'chat-msg system';
  div.textContent = text;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.value).then(() => {
    const btn = el.parentElement.querySelector('button');
    if (btn) { const t = btn.textContent; btn.textContent = 'Copié !'; setTimeout(() => btn.textContent = t, 1500); }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;
}

// P2P file transfer over WebRTC Data Channel (chunked binary)
// Works with both PeerJS connections and raw DataChannel wrappers.

const CHUNK_SIZE = 64 * 1024; // 64 KB

// ─── Sender ──────────────────────────────────────────────────────────────────

async function sendFile(connection, blob, metadata, onProgress) {
  // 1. Send metadata header
  const header = JSON.stringify({
    type: 'file-header',
    name: metadata.name,
    mimeType: metadata.mimeType,
    size: blob.size,
    totalChunks: Math.ceil(blob.size / CHUNK_SIZE),
  });
  connection.send(header);

  // 2. Send chunks
  const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, blob.size);
    const chunk = await blob.slice(start, end).arrayBuffer();
    connection.send(chunk);
    if (onProgress) onProgress(Math.round(((i + 1) / totalChunks) * 100));

    // Yield to avoid saturating the data channel buffer
    if (i % 16 === 15) await new Promise(r => setTimeout(r, 50));
  }

  // 3. Send end marker
  connection.send(JSON.stringify({ type: 'file-end', name: metadata.name }));
}

// ─── Receiver ────────────────────────────────────────────────────────────────

class FileReceiver {
  constructor() {
    this.transfers = {}; // name → { meta, chunks, received }
    this.onFileComplete = null; // callback(blob, metadata, fromLabel)
    this.onProgress = null;     // callback(name, percent, fromLabel)
  }

  // Call this for every incoming message on a data channel
  handleMessage(data, fromLabel) {
    if (typeof data === 'string') {
      let msg;
      try { msg = JSON.parse(data); } catch { return false; }

      if (msg.type === 'file-header') {
        this.transfers[msg.name] = {
          meta: msg,
          chunks: [],
          received: 0,
          from: fromLabel,
        };
        return true;
      }

      if (msg.type === 'file-end') {
        const transfer = this.transfers[msg.name];
        if (!transfer) return true;
        const blob = new Blob(transfer.chunks, { type: transfer.meta.mimeType });
        delete this.transfers[msg.name];
        if (this.onFileComplete) this.onFileComplete(blob, transfer.meta, transfer.from);
        return true;
      }

      return false; // not a file message, let caller handle
    }

    // Binary chunk — find the active transfer for this sender
    const transfer = Object.values(this.transfers).find(t => t.from === fromLabel);
    if (!transfer) return false;

    transfer.chunks.push(data);
    transfer.received += data.byteLength ?? data.size ?? 0;

    if (this.onProgress) {
      const pct = Math.round((transfer.received / transfer.meta.size) * 100);
      this.onProgress(transfer.meta.name, pct, fromLabel);
    }
    return true;
  }
}

// IndexedDB storage for completed recordings
// Blobs are stored as references — audio data stays on disk, not in JS heap.

const DB_NAME    = 'recast';
const DB_VERSION = 1;
const STORE      = 'recordings';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error);
  });
}

const RecordingStorage = {
  async save(blob, name) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx   = db.transaction(STORE, 'readwrite');
      const req  = tx.objectStore(STORE).add({
        name,
        mimeType: blob.type,
        size: blob.size,
        date: new Date().toISOString(),
        blob,
      });
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  },

  async list() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  },

  async delete(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  },
};

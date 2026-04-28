// Local audio recorder using MediaRecorder API

const PREFERRED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

function getSupportedMimeType() {
  for (const type of PREFERRED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.chunks = [];
    this.stream = null;
    this.mimeType = getSupportedMimeType();
    this.startTime = null;
    this.onStateChange = null; // callback('recording' | 'stopped' | 'error')
  }

  async requestPermission() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      return true;
    } catch (e) {
      console.error('Microphone permission denied:', e);
      return false;
    }
  }

  start() {
    if (!this.stream) throw new Error('No stream — call requestPermission() first');
    this.chunks = [];
    this.startTime = Date.now();

    const options = this.mimeType ? { mimeType: this.mimeType } : {};
    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };

    this.mediaRecorder.onstart = () => {
      if (this.onStateChange) this.onStateChange('recording');
    };

    this.mediaRecorder.onerror = (e) => {
      console.error('MediaRecorder error:', e);
      if (this.onStateChange) this.onStateChange('error');
    };

    // Collect data every 5 seconds (safety net; main blob collected on stop)
    this.mediaRecorder.start(5000);
  }

  stop() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mimeType || 'audio/webm' });
        if (this.onStateChange) this.onStateChange('stopped');
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  getElapsedSeconds() {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  isRecording() {
    return this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }

  releaseStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }
}

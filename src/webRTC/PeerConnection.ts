type Callbacks = {
  onTrack: (stream: MediaStream) => void;
  onCandidate: (candidate: RTCIceCandidateInit) => void;
  onOffer: (offer: RTCSessionDescriptionInit) => void;
  onAnswer: (answer: RTCSessionDescriptionInit) => void;
};

export default class PeerConnection {
  private pc: RTCPeerConnection;
  private stream: MediaStream;
  private callbacks: Callbacks;
  private candidateQueue: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;
  private remoteStream: MediaStream | null = null;

  constructor(config: { stream: MediaStream } & Callbacks) {
    this.stream = config.stream;
    this.callbacks = config;

    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.callbacks.onCandidate(event.candidate.toJSON());
      }
    };

    this.pc.ontrack = (event) => {
      if (!this.remoteStream) this.remoteStream = new MediaStream();
      this.remoteStream.addTrack(event.track);
      this.callbacks.onTrack(this.remoteStream);
    };

    this.stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.stream);
    });
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.callbacks.onOffer(offer);
  }

  async createAnswer() {
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    this.callbacks.onAnswer(answer);
  }

  async setRemoteOffer(offer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
    this.remoteDescriptionSet = true;
    await this.flushCandidateQueue();
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
    this.remoteDescriptionSet = true;
    await this.flushCandidateQueue();
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.remoteDescriptionSet) {
      this.candidateQueue.push(candidate);
      return;
    }

    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Failed to add ICE candidate", err);
    }
  }

  close() {
    this.pc.close();
  }

  private async flushCandidateQueue() {
    for (const candidate of this.candidateQueue) {
      try {
        await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding buffered ICE candidate", err);
      }
    }
    this.candidateQueue = [];
  }
}

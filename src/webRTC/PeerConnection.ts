type PeerConnectionConfig = {
  stream: MediaStream;
  onTrack: (remote: MediaStream) => void;
  onCandidate: (candidate: RTCIceCandidate) => void;
  onOffer: (offer: RTCSessionDescriptionInit) => void;
  onAnswer: (answer: RTCSessionDescriptionInit) => void;
};

export default class PeerConnection {
  private pc: RTCPeerConnection;
  private stream: MediaStream;
  private remoteStream: MediaStream;
  private onTrack: (remote: MediaStream) => void;
  private onCandidate: (candidate: RTCIceCandidate) => void;
  private onOffer: (offer: RTCSessionDescriptionInit) => void;
  private onAnswer: (answer: RTCSessionDescriptionInit) => void;

  constructor(config: PeerConnectionConfig) {
    this.stream = config.stream;
    this.onTrack = config.onTrack;
    this.onCandidate = config.onCandidate;
    this.onOffer = config.onOffer;
    this.onAnswer = config.onAnswer;

    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.remoteStream = new MediaStream();

    this.pc.onicecandidate = (e) => {
      if (e.candidate) this.onCandidate(e.candidate);
    };

    this.pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
      this.onTrack(this.remoteStream);
    };

    this.stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.stream);
    });
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.onOffer(offer);
  }

  async setRemoteOffer(offer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
  }

  async createAnswer() {
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    this.onAnswer(answer);
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Failed to add ICE candidate", err);
    }
  }

  close() {
    this.pc.close();
  }
}

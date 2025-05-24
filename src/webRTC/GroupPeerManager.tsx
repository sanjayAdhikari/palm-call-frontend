import * as mediasoupClient from "mediasoup-client";
import { Socket } from "socket.io-client";
import Emitter from "./Emitter";

const supportedMimeTypes = ["audio/opus"];

export default class GroupPeerManager {
  private socket: Socket;
  private device: mediasoupClient.Device | null = null;
  private recvTransport: mediasoupClient.types.Transport | null = null;
  private localProducerId: string | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();

  constructor(socket: Socket) {
    this.socket = socket;
  }

  async joinRoom(localStream: MediaStream) {
    try {
      console.log("[GroupPeerManager] Starting joinRoom()");

      this.socket.emit("get-rtp-capabilities");
      const routerRtpCapabilities = await this.waitForEvent("rtp-capabilities");
      console.log(
        "[GroupPeerManager] RTP Capabilities received",
        routerRtpCapabilities,
      );

      this.device = new mediasoupClient.Device();
      await this.device.load({ routerRtpCapabilities });

      // Step 2: Create send transport
      this.socket.emit("create-transport");
      const { id, iceParameters, iceCandidates, dtlsParameters } =
        await this.waitForEvent("transport-created");

      const sendTransport = this.device.createSendTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        iceServers: [],
        additionalSettings: {},
        proprietaryConstraints: {},
      });

      sendTransport.on("connect", ({ dtlsParameters }, callback) => {
        this.socket.emit("connect-transport", { dtlsParameters });
        this.socket.once("transport-connected", callback);
      });

      sendTransport.on("produce", async ({ kind, rtpParameters }, callback) => {
        this.socket.emit("produce", { kind, rtpParameters });
        const { id } = await this.waitForEvent("produced");
        this.localProducerId = id;
        callback({ id });
      });

      const audioTrack = localStream.getAudioTracks()[0];
      if (!audioTrack) throw new Error("No audio track available");

      await sendTransport.produce({ track: audioTrack });

      // Step 3: Create recv transport
      this.socket.emit("create-recv-transport");
      const recvData = await this.waitForEvent("recv-transport-created");

      this.recvTransport = this.device.createRecvTransport({
        id: recvData.id,
        iceParameters: recvData.iceParameters,
        iceCandidates: recvData.iceCandidates,
        dtlsParameters: recvData.dtlsParameters,
      });

      this.recvTransport.on("connect", ({ dtlsParameters }, callback) => {
        this.socket.emit("connect-recv-transport", { dtlsParameters });
        this.socket.once("recv-transport-connected", callback);
      });

      // Step 4: Consume others
      this.socket.emit("consume", {
        rtpCapabilities: this.device.rtpCapabilities,
      });

      this.socket.on(
        "consumed",
        async ({ id, producerId, kind, rtpParameters }) => {
          if (!this.recvTransport) return;

          const consumer = await this.recvTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
          });

          const stream = new MediaStream([consumer.track]);
          this.remoteStreams.set(producerId, stream);
          Emitter.emit("call:streams:group", { id: producerId, stream });
        },
      );

      return "joined";
    } catch (err) {
      console.error("[GroupPeerManager] joinRoom error", err);
      throw err;
    }
  }

  leaveRoom() {
    this.remoteStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    });
    this.remoteStreams.clear();
    this.localProducerId = null;
  }

  setMicEnabled(enabled: boolean) {
    this.socket.emit("push-to-talk", { enabled });
  }

  handleSpeakingStatus(socketId: string, isSpeaking: boolean) {
    const stream = this.remoteStreams.get(socketId);
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isSpeaking;
      });
    }
  }

  private async waitForEvent(eventName: string): Promise<any> {
    return new Promise((resolve) => {
      this.socket.once(eventName, (data) => resolve(data));
    });
  }
}

import { SocketEventEnum } from "interfaces";
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

      this.socket.emit(SocketEventEnum.GET_RTP_CAPABILITIES);
      const routerRtpCapabilities = await this.waitForEvent(SocketEventEnum.GET_RTP_CAPABILITIES);
      console.log(
        "[GroupPeerManager] RTP Capabilities received",
        routerRtpCapabilities,
      );

      this.device = new mediasoupClient.Device();
      await this.device.load({ routerRtpCapabilities });
      console.log('device loaded', this.device)
      // Step 2: Create send transport
      this.socket.emit(SocketEventEnum.CREATE_TRANSPORT);
      const { id, iceParameters, iceCandidates, dtlsParameters } =
        await this.waitForEvent(SocketEventEnum.CREATE_TRANSPORT);

      const sendTransport = this.device.createSendTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        iceServers: [],
        additionalSettings: {},
        proprietaryConstraints: {},
      });

      sendTransport.on(SocketEventEnum.CONNECT, ({ dtlsParameters }, callback) => {
        this.socket.emit(SocketEventEnum.CONNECT_TRANSPORT, { dtlsParameters });
        this.socket.once(SocketEventEnum.CONNECT_TRANSPORT, callback);
      });

      sendTransport.on(SocketEventEnum.PRODUCE, async ({ kind, rtpParameters }, callback) => {
        this.socket.emit(SocketEventEnum.PRODUCE, { kind, rtpParameters });
        const { id } = await this.waitForEvent(SocketEventEnum.PRODUCE);
        this.localProducerId = id;
        callback({ id });
      });

      const audioTrack = localStream.getAudioTracks()[0];
      console.log('audioTrack ->', audioTrack)
      if (!audioTrack) throw new Error("No audio track available");

      await sendTransport.produce({ track: audioTrack });

      // Step 3: Create recv transport
      this.socket.emit(SocketEventEnum.CREATE_RECV_TRANSPORT);
      const recvData = await this.waitForEvent(SocketEventEnum.CREATE_RECV_TRANSPORT);
      console.log('waitForEvent::recvData ->', recvData)

      this.recvTransport = this.device.createRecvTransport({
        id: recvData.id,
        iceParameters: recvData.iceParameters,
        iceCandidates: recvData.iceCandidates,
        dtlsParameters: recvData.dtlsParameters,
      });

      this.recvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
        this.socket.emit(SocketEventEnum.CONNECT_RECV_TRANSPORT, { dtlsParameters });

        this.socket.once(SocketEventEnum.CONNECT_RECV_TRANSPORT, callback); // ✅ correct signal
        this.socket.once(SocketEventEnum.ERROR, errback); // optional
      });


      // Step 4: Consume others
      this.socket.emit(SocketEventEnum.CONSUME, {
        rtpCapabilities: this.device.rtpCapabilities,
      });

      this.socket.off(SocketEventEnum.CONSUME); // remove old
      this.socket.on(SocketEventEnum.CONSUME,
        async ({ id, producerId, kind, rtpParameters }) => {
          console.log("[Client] Received consumed event:", producerId);
          if (!this.recvTransport) return;

          if (this.remoteStreams.has(producerId)) {
            console.warn("🔁 Already consuming producer:", producerId);
            return;
          }

          console.log("📥 Received remote consumer:", {
            id,
            producerId,
            kind,
            rtpParameters,
          });

          const consumer = await this.recvTransport.consume({ id, producerId, kind, rtpParameters });


          console.log("🎧 consumer.track:", consumer.track);
          console.log("🎧 consumer.track.readyState:", consumer.track.readyState);
          console.log("🎧 consumer.track.enabled:", consumer.track.enabled);

          const stream = new MediaStream([consumer.track]);
          this.remoteStreams.set(producerId, stream);
          Emitter.emit("call:streams:group", { id: producerId, stream });
        },
      );
      console.log('join Room done-> ', this.localProducerId)

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

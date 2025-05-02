export default class MediaDevice {
  stream: MediaStream | null = null;

  async start(type: "audio" | "video" = "video"): Promise<MediaStream> {
    if (this.stream) return this.stream;

    const constraints =
      type === "audio"
        ? { audio: true, video: false }
        : { audio: true, video: true };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (err) {
      console.error("Media access denied:", err);
      throw err;
    }
  }

  stop() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }
}

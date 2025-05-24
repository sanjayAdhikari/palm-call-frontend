export default class MediaDevice {
  stream: MediaStream | null = null;
  selectedMicLabel: string | null = null;

  async start(type: "audio" | "video" = "video"): Promise<MediaStream> {
    if (this.stream) return this.stream;

    const constraints =
      type === "audio"
        ? { audio: true, video: false }
        : { audio: true, video: true };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const usedMic = devices.find(
        (d) =>
          d.kind === "audioinput" &&
          this.stream.getAudioTracks()[0].label.includes(d.label),
      );
      // Save mic label for access
      this.selectedMicLabel = usedMic?.label;

      console.log("🎙️ Mic in use:", usedMic?.label || "Unknown");
      return this.stream;
    } catch (err) {
      console.error("Media access denied:", err);
      throw err;
    }
  }

  getSelectedMicLabel(): string | null {
    return this.selectedMicLabel || null;
  }

  stop() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }
}

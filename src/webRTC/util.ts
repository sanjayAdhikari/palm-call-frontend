// Debug monitor for local audio stream
export const monitorLocalAudio = (stream: MediaStream) => {
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);

  const interval = setInterval(() => {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((sum, v) => sum + v, 0);
    if (volume > 1000) {
      console.log("🎤 Local audio is transmitting: volume =", volume);
    }
  }, 1000);

  // Optional: store intervalRef to stop monitoring later
};

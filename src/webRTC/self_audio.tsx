import React, { useEffect } from "react";

const SelfAudioTest: React.FC = () => {
  useEffect(() => {
    const run = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const audio = document.createElement("audio");
        audio.autoplay = true;
        audio.controls = true;
        audio.muted = false;
        audio.volume = 1;
        audio.srcObject = stream;
        document.body.appendChild(audio);

        console.log("🎙️ Self mic test stream started");
      } catch (err) {
        console.error("❌ Failed to get mic", err);
      }
    };

    run();
  }, []);

  return null;
};

export default SelfAudioTest;

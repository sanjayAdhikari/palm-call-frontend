import React, { useEffect, useRef } from "react";
import { useCall } from "./useCall";

const RemoteAudioRenderer: React.FC = () => {
  const { onStreams } = useCall();
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    console.log('remote is speaking...')
    const handleStream = ({ id, stream }: { id: string; stream: MediaStream }) => {
      let audio = audioRefs.current.get(id);

      if (!audio) {
        audio = document.createElement("audio");
        audio.autoplay = true;
        audio.muted = false;
        audio.controls = true; // shows control for debugging
        document.body.appendChild(audio); // ensures it can play
        console.log("💽 new audio element created for:", id);
        audioRefs.current.set(id, audio);
      }

      console.log("💽 remote stream assigned:", stream);
      const track = stream.getAudioTracks()[0];
      console.log("🎧 track info", {
        enabled: track?.enabled,
        readyState: track?.readyState,
        label: track?.label,
      });
      if (!track?.enabled || track.readyState !== "live") {
        console.warn("⚠️ Track is not live or disabled:", id);
      }

      if (audio.srcObject !== stream) {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        let stopped = false;

        const checkVolume = () => {
          if (stopped) return;

          analyser.getByteFrequencyData(data);
          const volume = data.reduce((a, b) => a + b, 0);
          console.log(`🔊 Volume detected from ${id}:`, volume);
          requestAnimationFrame(checkVolume);
        }

        checkVolume();
        audio.srcObject = stream;

        setTimeout(() => {
          audio
            .play()
            .then(() => {
              console.log("✅ Playing remote stream for:", id);
            })
            .catch((err) => {
              console.warn(`🔇 Failed to autoplay stream from ${id}`, err);
            });
        }, 100);
        return () => {
          stopped = true;
          ctx.close();
        };
      }
    };

    const unsubscribe = onStreams(handleStream);
    return unsubscribe;
  }, [onStreams]);

  return null;
};

export default RemoteAudioRenderer;

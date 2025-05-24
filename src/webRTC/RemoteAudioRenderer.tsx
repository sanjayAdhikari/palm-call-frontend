import React, { useEffect, useRef } from "react";
import { useCall } from "./useCall";

const RemoteAudioRenderer: React.FC = () => {
  const { onStreams } = useCall();
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    const handleStream = ({
      id,
      stream,
    }: {
      id: string;
      stream: MediaStream;
    }) => {
      let audio = audioRefs.current.get(id);

      if (!audio) {
        audio = new Audio();
        audio.autoplay = true;
        audio.muted = false;
        console.log("💽 new audio :", id);
        audioRefs.current.set(id, audio);
      }
      console.log("💽 remote stream assigned:", stream);

      // only set srcObject if different
      if (audio.srcObject !== stream) {
        audio.srcObject = stream;

        // wait for metadata to load before playing
        audio.onloadedmetadata = () => {
          audio
            .play()
            .then(() => {
              console.log("🎧 Playing remote stream for:", id);
            })
            .catch((err) => {
              console.warn(`🔇 Failed to autoplay stream from ${id}`, err);
            });
        };
      }
    };

    const unsubscribe = onStreams(handleStream);
    return unsubscribe;
  }, [onStreams]);

  return null;
};

export default RemoteAudioRenderer;

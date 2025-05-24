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
      let audioEl = audioRefs.current.get(id);
      if (!audioEl) {
        audioEl = new Audio();
        audioEl.autoplay = true;
        audioEl.muted = false;
        audioRefs.current.set(id, audioEl);
        console.log("🎧 Created new audio element for:", id);
      }
      audioEl.srcObject = stream;
      audioEl
        .play()
        .catch((err) =>
          console.warn(`🔇 Failed to autoplay stream from ${id}`, err),
        );
    };

    const unsubscribe = onStreams(handleStream);
    return unsubscribe;
  }, [onStreams]);

  return null;
};

export default RemoteAudioRenderer;

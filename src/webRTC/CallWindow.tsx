import React, { useEffect, useRef } from "react";
import Emitter from "./Emitter";
import { useCall } from "./useCall";

const CallWindow: React.FC = () => {
  const { endCall, isReceiving, isCalling } = useCall();
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleStreams = ({
      local,
      remote,
    }: {
      local: MediaStream;
      remote: MediaStream;
    }) => {
      if (localRef.current) localRef.current.srcObject = local;
      if (remoteRef.current && remote) remoteRef.current.srcObject = remote;
    };

    Emitter.on("call:streams", handleStreams);
    return () => {
      Emitter.off("call:streams", handleStreams);
    };
  }, []);

  if (!isReceiving && !isCalling) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="w-[500px] h-[300px] bg-gray-800 rounded"
        />
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="w-[150px] h-[100px] bg-gray-700 rounded self-end"
        />
        <button
          onClick={endCall}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default CallWindow;

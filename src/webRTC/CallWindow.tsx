import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Emitter from "./Emitter";
import { useCall } from "./useCall";

const CallWindow: React.FC = () => {
  const { endCall, isReceiving, isCalling, callerInfo, callType } = useCall();
  console.log("callerInfo", callerInfo);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const handleStreams = ({
      local,
      remote,
    }: {
      local: MediaStream;
      remote: MediaStream;
    }) => {
      if (localRef.current) {
        localRef.current.srcObject = local;
        localStreamRef.current = local;
      }
      if (remoteRef.current && remote) {
        remoteRef.current.srcObject = remote;
      }
    };

    Emitter.on("call:streams", handleStreams);
    return () => {
      Emitter.off("call:streams", handleStreams);
    };
  }, []);

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  if (!isReceiving && !isCalling) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-white font-semibold text-lg">
          {callerInfo?.name
            ? `Talking with ${callerInfo.name}`
            : "Call in progress..."}
        </div>
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
        <div className="flex gap-4 mt-4">
          <button
            onClick={toggleMute}
            className="bg-yellow-500 p-2 rounded-full text-white"
          >
            {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          {callType === "video" && (
            <button
              onClick={toggleVideo}
              className="bg-indigo-500 p-2 rounded-full text-white"
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          )}
          <button
            onClick={endCall}
            className="bg-red-600 p-2 rounded-full text-white"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallWindow;

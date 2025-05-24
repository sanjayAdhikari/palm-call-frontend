import { Mic, MicOff, PhoneOff } from "lucide-react";
import React, { useState } from "react";
import RemoteAudioRenderer from "./RemoteAudioRenderer";
import { useCall } from "./useCall";

const CallWindow: React.FC = () => {
  const { isConnected, leaveCall, toggleMic, micLabel } = useCall();
  const [isMuted, setMuted] = useState(false);
  console.log("*****isConnected!!!!!", isConnected);
  if (!isConnected) return null;

  const toggle = () => {
    toggleMic(isMuted);
    setMuted((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-2">Group Audio Call</h2>
      <p className="text-sm text-gray-400 mb-6">{micLabel}</p>

      <RemoteAudioRenderer />

      <div className="flex gap-4">
        <button onClick={toggle} className="bg-yellow-500 p-3 rounded-full">
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button onClick={leaveCall} className="bg-red-600 p-3 rounded-full">
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};

export default CallWindow;

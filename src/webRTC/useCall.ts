import { useContext } from "react";
import { WebRTCCallContext } from "./WebRTCCallProvider";

export const useCall = () => {
  const context = useContext(WebRTCCallContext);

  if (!context) {
    throw new Error("useCall must be used within a WebRTCCallProvider");
  }

  return {
    isConnected: context.isConnected,
    isReceiving: context.isReceiving,
    incomingCall: context.incomingCall,
    joinCall: context.joinCall,
    leaveCall: context.leaveCall,
    toggleMic: context.toggleMic,
    acceptCall: context.acceptCall,
    rejectCall: context.rejectCall,
    onStreams: context.onStreams,
    callerInfo: context.callerInfo,
    micLabel: context.micLabel,
  };
};

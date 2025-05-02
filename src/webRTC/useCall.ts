import { SocketEventEnum } from "interfaces";
import { useContext } from "react";
import { getSocket } from "../socket/socketClient";
import Emitter from "./Emitter";
import { WebRTCCallContext } from "./WebRTCCallProvider";

export const useCall = () => {
  const { isCalling, isReceiving, callType, callerId, setState } =
    useContext(WebRTCCallContext);

  const startCall = (to: string, type: "audio" | "video") => {
    setState((prev) => ({
      ...prev,
      isCalling: true,
      callType: type,
      callerId: to,
    }));
    Emitter.emit("call:start", { to, type });
  };

  const acceptCall = () => {
    setState((prev) => ({ ...prev, isCalling: true, isReceiving: false }));
    Emitter.emit("call:accept");
  };

  const rejectCall = () => {
    getSocket().emit(SocketEventEnum.END);
    Emitter.emit("call:reject");
    resetState();
  };

  const endCall = () => {
    getSocket().emit(SocketEventEnum.END, { to: callerId });
    Emitter.emit("call:end");
    resetState();
  };

  const resetState = () => {
    setState({
      isCalling: false,
      isReceiving: false,
      callType: null,
      callerId: null,
    });
  };

  const isInCall = isCalling && !isReceiving;

  return {
    isCalling,
    isReceiving,
    isInCall,
    callType,
    callerId,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  };
};

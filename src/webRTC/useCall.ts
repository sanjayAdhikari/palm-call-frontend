import { IUser, SocketEventEnum } from "interfaces";
import { useContext, useEffect, useState } from "react";
import { getSocket } from "../socket/socketClient";
import Emitter from "./Emitter";
import { WebRTCCallContext } from "./WebRTCCallProvider";

export const useCall = () => {
  const { isCalling, isReceiving, callType, callerId, setState } =
    useContext(WebRTCCallContext);

  const [callerInfo, setCallerInfo] = useState<IUser | null>(null);
  const socket = getSocket();

  const startCall = (to: string, type: "audio" | "video", callee: IUser) => {
    setState((prev) => ({
      ...prev,
      isCalling: true,
      callType: type,
      callerId: to,
    }));
    setCallerInfo(callee); // 👈 set callee info for initiator
    Emitter.emit("call:start", { to, type });
  };

  const acceptCall = () => {
    setState((prev) => ({
      ...prev,
      isCalling: true,
      isReceiving: false,
    }));
    Emitter.emit("call:accept");
  };

  const rejectCall = () => {
    socket.emit(SocketEventEnum.END, { to: callerId });
    Emitter.emit("call:reject");
    resetState();
  };

  const endCall = () => {
    socket.emit(SocketEventEnum.END, { to: callerId });
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
    setCallerInfo(null);
  };

  const isInCall = isCalling && !isReceiving;

  useEffect(() => {
    const handleIncoming = ({
      from,
      type,
    }: {
      from: IUser;
      type: "audio" | "video";
    }) => {
      setCallerInfo(from); // 👈 treat 'from' as IUser
    };

    const handleEnd = () => {
      resetState();
    };

    Emitter.on("call:incoming", handleIncoming);
    Emitter.on("call:end", handleEnd);

    return () => {
      Emitter.off("call:incoming", handleIncoming);
      Emitter.off("call:end", handleEnd);
    };
  }, []);

  return {
    isCalling,
    isReceiving,
    isInCall,
    callType,
    callerId,
    callerInfo,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  };
};

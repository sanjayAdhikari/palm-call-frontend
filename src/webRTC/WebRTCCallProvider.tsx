import { IUser, SocketEventEnum } from "interfaces";
import React, { createContext, useEffect, useRef, useState } from "react";
import { getAccessToken } from "utils";
import { initSocket } from "../socket/socketClient";
import Emitter from "./Emitter";
import MediaDevice from "./MediaDevice";
import PeerConnection from "./PeerConnection";

const initialState = {
  isCalling: false,
  isReceiving: false,
  callType: null as "audio" | "video" | null,
  callerId: null,
  callerProfile: null,
};
export const WebRTCCallContext = createContext({
  ...initialState,
  setState: (_: any) => {},
});

export const WebRTCCallProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [callState, setCallState] = useState(initialState);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  const peerRef = useRef<PeerConnection | null>(null);
  const mediaRef = useRef<MediaDevice | null>(null);
  const socket = initSocket(getAccessToken());

  const reset = () => {
    peerRef.current?.close();
    mediaRef.current?.stop();

    peerRef.current = null;
    mediaRef.current = null;
    setRemoteStream(null);
    setLocalStream(null);
    setIncomingCall(null);
    setCallState(initialState);
    Emitter.emit("call:end");
  };

  const initCall = async (
    isCaller: boolean,
    type: "audio" | "video",
    remoteUserId: IUser,
  ) => {
    mediaRef.current = new MediaDevice();
    const local = await mediaRef.current.start(type);
    setLocalStream(local);
    Emitter.emit("call:streams", { local, remote: null });

    peerRef.current = new PeerConnection({
      stream: local,
      onTrack: (stream) => {
        setRemoteStream(stream);
        Emitter.emit("call:streams", { local, remote: stream });
      },
      onCandidate: (candidate) => {
        socket.emit(SocketEventEnum.ICE_CANDIDATE, {
          to: remoteUserId?._id,
          candidate,
        });
      },
      onOffer: (offer) => {
        socket.emit(SocketEventEnum.OFFER, {
          to: remoteUserId?._id,
          offer,
          type,
        });
      },
      onAnswer: (answer) => {
        socket.emit(SocketEventEnum.ANSWER, { to: remoteUserId?._id, answer });
      },
    });

    if (isCaller) {
      await peerRef.current.createOffer();
    }
  };

  useEffect(() => {
    socket.on(SocketEventEnum.OFFER, async ({ from, offer, type }) => {
      setIncomingCall({ from, offer, type });
      setCallState((prev) => ({
        ...prev,
        isReceiving: true,
        callType: type,
        callerId: from?._id,
        callerProfile: from,
      }));
      Emitter.emit("call:incoming", { from, type });
    });

    socket.on(SocketEventEnum.ANSWER, async ({ answer }) => {
      await peerRef.current?.setRemoteAnswer(answer);
    });

    socket.on(SocketEventEnum.ICE_CANDIDATE, async ({ candidate }) => {
      await peerRef.current?.addIceCandidate(candidate);
    });

    socket.on(SocketEventEnum.END, () => {
      reset(); // this will end call for both parties
    });

    return () => {
      socket.off(SocketEventEnum.OFFER);
      socket.off(SocketEventEnum.ANSWER);
      socket.off(SocketEventEnum.ICE_CANDIDATE);
      socket.off(SocketEventEnum.END);
    };
  }, []);

  useEffect(() => {
    const handleStart = ({
      to,
      type,
    }: {
      to: string;
      type: "audio" | "video";
    }) => {
      setCallState((prev) => ({
        ...prev,
        isCalling: true,
        callType: type,
        callerId: to,
      }));
      initCall(true, type, to);
    };

    const handleAccept = async () => {
      if (!incomingCall) return;
      const { from, offer, type } = incomingCall;
      setCallState((prev) => ({
        ...prev,
        isCalling: true,
        isReceiving: false,
        callerId: from,
        callType: type,
      }));
      await initCall(false, type, from);
      await peerRef.current?.setRemoteOffer(offer);
      await peerRef.current?.createAnswer();
    };

    const handleReject = () => {
      socket.emit(SocketEventEnum.END, { to: incomingCall.from?._id });
      reset();
    };

    Emitter.on("call:start", handleStart);
    Emitter.on("call:accept", handleAccept);
    Emitter.on("call:reject", handleReject);

    return () => {
      Emitter.off("call:start", handleStart);
      Emitter.off("call:accept", handleAccept);
      Emitter.off("call:reject", handleReject);
    };
  }, [incomingCall]);

  return (
    <WebRTCCallContext.Provider
      value={{ ...callState, setState: setCallState }}
    >
      {children}
    </WebRTCCallContext.Provider>
  );
};

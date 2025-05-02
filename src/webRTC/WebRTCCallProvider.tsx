import { IUser, SocketEventEnum } from "interfaces";
import React, { createContext, useEffect, useRef, useState } from "react";
import { getAccessToken } from "utils";
import { initSocket } from "../socket/socketClient";
import Emitter from "./Emitter";
import MediaDevice from "./MediaDevice";
import PeerConnection from "./PeerConnection";

interface WebRTCCallContextType {
  isCalling: boolean;
  isReceiving: boolean;
  callType: "audio" | "video" | null;
  callerId: string | null;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

export const WebRTCCallContext = createContext<WebRTCCallContextType>({
  isCalling: false,
  isReceiving: false,
  callType: null,
  callerId: null,
  setState: () => {},
});

export const WebRTCCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState({
    isCalling: false,
    isReceiving: false,
    callType: null as "audio" | "video" | null,
    callerId: null as string | null,
  });

  const peerRef = useRef<PeerConnection | null>(null);
  const mediaRef = useRef<MediaDevice | null>(null);

  const socket = useRef(initSocket(getAccessToken())).current;

  // Listen to call:start from emitter (initiator)
  useEffect(() => {
    const handleStart = async ({
      to,
      type,
    }: {
      to: string;
      type: "audio" | "video";
    }) => {
      mediaRef.current = new MediaDevice();
      const local = await mediaRef.current.start(type);

      peerRef.current = new PeerConnection({
        stream: local,
        onTrack: (remote) => {
          Emitter.emit("call:streams", { local, remote });
        },
        onCandidate: (candidate) => {
          socket.emit(SocketEventEnum.ICE_CANDIDATE, {
            to,
            candidate,
          });
        },
        onOffer: (offer) => {
          socket.emit(SocketEventEnum.OFFER, { to, offer, type });
        },
        onAnswer: (answer) => {
          socket.emit(SocketEventEnum.ANSWER, { to, answer });
        },
      });

      await peerRef.current.createOffer();
    };

    Emitter.on("call:start", handleStart);
    return () => {
      Emitter.off("call:start", handleStart);
    };
  }, [socket]);

  // Listen to offer from other peer
  useEffect(() => {
    socket.on(
      SocketEventEnum.OFFER,
      async ({
        from,
        offer,
        type,
      }: {
        from: IUser;
        offer: RTCSessionDescriptionInit;
        type: "audio" | "video";
      }) => {
        setState((prev) => ({
          ...prev,
          isReceiving: true,
          callType: type,
          callerId: from._id,
        }));
        Emitter.emit("call:incoming", { from, type });
        // Save offer/caller for use after accept
        peerRef.current = {
          offer,
          caller: from,
        } as any;
      },
    );
  }, [socket]);

  // Listen for accept
  useEffect(() => {
    const handleAccept = async () => {
      const { offer, caller } = peerRef.current as any;
      mediaRef.current = new MediaDevice();
      const local = await mediaRef.current.start(state.callType!);

      const pc = new PeerConnection({
        stream: local,
        onTrack: (remote) => {
          Emitter.emit("call:streams", { local, remote });
        },
        onCandidate: (candidate) => {
          socket.emit(SocketEventEnum.ICE_CANDIDATE, {
            to: caller._id,
            candidate,
          });
        },
        onOffer: () => {},
        onAnswer: (answer) => {
          socket.emit(SocketEventEnum.ANSWER, {
            to: caller._id,
            answe,
          });
        },
      });

      peerRef.current = pc;
      await pc.setRemoteOffer(offer);
      await pc.createAnswer();
    };

    Emitter.on("call:accept", handleAccept);
    return () => {
      Emitter.off("call:accept", handleAccept);
    };
  }, [state.callType, socket]);

  // Remote answer (received by initiator)
  useEffect(() => {
    socket.on(
      SocketEventEnum.ANSWER,
      async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        await peerRef.current?.setRemoteAnswer(answer);
      },
    );
  }, [socket]);

  // ICE candidate
  useEffect(() => {
    socket.on(SocketEventEnum.ICE_CANDIDATE, async ({ candidate }) => {
      await peerRef.current?.addIceCandidate(candidate);
    });
  }, [socket]);

  // End
  useEffect(() => {
    socket.on(SocketEventEnum.END, () => {
      Emitter.emit("call:end");
      peerRef.current?.close();
      mediaRef.current?.stop();
      peerRef.current = null;
      mediaRef.current = null;
    });
  }, [socket]);

  return (
    <WebRTCCallContext.Provider value={{ ...state, setState }}>
      {children}
    </WebRTCCallContext.Provider>
  );
};

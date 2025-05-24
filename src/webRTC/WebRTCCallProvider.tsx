import { SocketEventEnum } from "interfaces";
import React, { createContext, useEffect, useRef, useState } from "react";
import { getAccessToken } from "utils";
import { initSocket } from "../socket/socketClient";
import Emitter from "./Emitter";
import GroupPeerManager from "./GroupPeerManager";
import MediaDevice from "./MediaDevice";

interface CallMetadata {
  meetingID: string;
  type: "audio" | "video";
}

interface CallerInfoInterface {
  name?: string;
  profileImage?: string;
}

interface WebRTCCallContextType {
  isConnected: boolean;
  isReceiving: boolean;
  incomingCall: CallMetadata | null;
  callerInfo?: CallerInfoInterface;
  joinCall: () => void;
  leaveCall: () => void;
  toggleMic: (enabled: boolean) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  onStreams: (
    fn: (data: { id: string; stream: MediaStream }) => void,
  ) => () => void;
  micLabel?: string | null;
}

export const WebRTCCallContext = createContext<WebRTCCallContextType>({
  isConnected: false,
  isReceiving: false,
  incomingCall: null,
  joinCall: () => {},
  leaveCall: () => {},
  toggleMic: () => {},
  acceptCall: () => {},
  rejectCall: () => {},
  onStreams: () => () => {},
  callerInfo: {},
  micLabel: null,
});

export const WebRTCCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallMetadata | null>(null);
  const [isReceiving, setReceiving] = useState(false);
  const [callerInfo, setCallerInfo] = useState<CallerInfoInterface>({});
  const [micLabel, setMicLabel] = useState<string | null>(null);

  const socketRef = useRef(
    initSocket(getAccessToken(), { meetingId: "GLOBAL" }),
  );
  const mediaRef = useRef<MediaDevice | null>(null);
  const peerManagerRef = useRef<GroupPeerManager | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const joinCall = async () => {
    try {
      console.log("[joinCall] isConnected:", isConnected);
      if (isConnected) return;

      const socket = socketRef.current;
      peerManagerRef.current = new GroupPeerManager(socket);
      mediaRef.current = new MediaDevice();

      console.log("[joinCall] Requesting audio stream...");
      const stream = await mediaRef.current.start("audio");
      localStreamRef.current = stream;

      console.log("[joinCall] Stream acquired", stream);
      console.log("[joinCall] Audio tracks: ", stream.getAudioTracks());

      const label = mediaRef.current.getSelectedMicLabel();
      setMicLabel(label);
      console.log("[joinCall] Media device in use ->", label);

      const response = await peerManagerRef.current.joinRoom(stream);
      console.log("[joinCall] Joined room successfully:", response);

      setConnected(true);
    } catch (err) {
      console.error("[joinCall] Error while starting call", err);
    }
  };

  const leaveCall = () => {
    console.log("[leaveCall] Cleaning up call...");
    const socket = socketRef.current;

    socket.emit("call:end", { meetingID: "global-room-abc123" });
    peerManagerRef.current?.leaveRoom();
    mediaRef.current?.stop();

    setConnected(false);
    setIncomingCall(null);
    setReceiving(false);
  };

  const toggleMic = (enabled: boolean) => {
    peerManagerRef.current?.setMicEnabled(enabled);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    joinCall();
    setReceiving(false);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    setReceiving(false);
    setIncomingCall(null);
  };

  useEffect(() => {
    const socket = socketRef.current;

    const handleCallStart = ({
      meetingID,
      type,
      callerInfo,
      initiatorId,
    }: any) => {
      const isCaller = initiatorId && socket.id === initiatorId;
      if (isCaller) {
        joinCall();
      } else {
        console.log("Incoming group call", meetingID, type);
        setReceiving(true);
        setIncomingCall({ meetingID, type });
        setCallerInfo(callerInfo);
      }
    };

    Emitter.on(SocketEventEnum.CALL_START, handleCallStart);
    socket.on(SocketEventEnum.CALL_START, handleCallStart);

    socket.on(SocketEventEnum.USER_SPEAKING, ({ socketId, isSpeaking }) => {
      peerManagerRef.current?.handleSpeakingStatus(socketId, isSpeaking);
    });

    socket.on("call:end", () => {
      console.log("🔕 Call ended by another participant");
      leaveCall();
    });

    return () => {
      Emitter.off(SocketEventEnum.CALL_START, handleCallStart);
      socket.off(SocketEventEnum.CALL_START, handleCallStart);
      socket.off(SocketEventEnum.CALL_END);
      socket.off(SocketEventEnum.USER_SPEAKING);
    };
  }, []);

  const onStreams = (
    fn: (data: { id: string; stream: MediaStream }) => void,
  ) => {
    Emitter.on("call:streams:group", fn);
    return () => Emitter.off("call:streams:group", fn);
  };

  return (
    <WebRTCCallContext.Provider
      value={{
        isConnected,
        isReceiving,
        incomingCall,
        joinCall,
        leaveCall,
        toggleMic,
        acceptCall,
        rejectCall,
        onStreams,
        callerInfo,
        micLabel,
      }}
    >
      {children}
    </WebRTCCallContext.Provider>
  );
};

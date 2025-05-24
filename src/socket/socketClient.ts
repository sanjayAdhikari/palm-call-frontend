import { SocketEventEnum } from "interfaces";
import { io, Socket } from "socket.io-client";
import { setAllOnline, setPresence } from "./presenceStore";

let socket: Socket | null = null;

export const joinThread = (threadId: string) => {
  getSocket().emit(SocketEventEnum.JOIN_THREAD, { threadId });
};

export const leaveThread = (threadId: string) => {
  getSocket().emit(SocketEventEnum.LEAVE_THREAD, { threadId });
};

export const initSocket = (
  token: string,
  query: Record<string, string> = { meetingId: "GLOBAL" },
): Socket => {
  if (socket && socket.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL as string, {
    auth: { token },
    query,
    transports: ["websocket"],
    reconnection: true,
  });

  socket.once(SocketEventEnum.CONNECT, () => {
    startPresenceListener();
    console.log("[SOCKET] Connected:", socket?.id);
  });

  socket.on(SocketEventEnum.DISCONNECT, () => {
    console.warn("[SOCKET] Disconnected");
  });

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket)
    throw new Error("Socket not initialized. Call initSocket first.");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessageViaSocket = (threadId: string, text: string) => {
  getSocket().emit(SocketEventEnum.MESSAGE, { threadId, text });
};

export const sendTyping = (threadId: string, isTyping: boolean) => {
  console.log("sendTyping", threadId, isTyping);
  getSocket().emit(
    isTyping ? SocketEventEnum.START_TYPING : SocketEventEnum.STOP_TYPING,
    { threadId },
  );
};

// 🔹 Attach listeners for typing and message
type TypingCallback = (from: string) => void;
type MessageCallback = (message: any) => void;

export const listenToTypingAndMessages = (
  currentUserId: string,
  onTypingChange: (typing: boolean) => void,
  onNewMessage: MessageCallback,
) => {
  const socket = getSocket();

  const handleStartTyping = ({ from }: { from: string }) => {
    if (from !== currentUserId) onTypingChange(true);
  };

  const handleStopTyping = ({ from }: { from: string }) => {
    if (from !== currentUserId) onTypingChange(false);
  };

  socket.on(SocketEventEnum.START_TYPING, handleStartTyping);
  socket.on(SocketEventEnum.STOP_TYPING, handleStopTyping);
  socket.on(SocketEventEnum.MESSAGE, onNewMessage);

  return () => {
    socket.off(SocketEventEnum.START_TYPING, handleStartTyping);
    socket.off(SocketEventEnum.STOP_TYPING, handleStopTyping);
    socket.off(SocketEventEnum.MESSAGE, onNewMessage);
  };
};

let hasPresenceListener = false;

export const startPresenceListener = () => {
  if (hasPresenceListener) return;

  socket.emit(SocketEventEnum.GET_ONLINE_USERS, {});

  socket.on(SocketEventEnum.USER_ONLINE, ({ userId }) => {
    console.log(userId, " came online");
    setPresence(userId, true);
  });

  socket.on(SocketEventEnum.USER_OFFLINE, ({ userId }) => {
    console.log(userId, " goes offline");
    setPresence(userId, false);
  });

  socket.on(SocketEventEnum.ONLINE_USERS, ({ userIds }) => {
    console.log(userIds, " have come to online");
    setAllOnline(userIds);
  });

  hasPresenceListener = true;
};

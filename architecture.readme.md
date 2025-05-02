# Architecture Overview: Real-Time Chat & WebRTC Calling System

This document outlines the technical architecture and component structure of the real-time chat and video/audio calling
system powered by **WebSockets**, **WebRTC**, and a **React + Node.js** stack.

---

## 🔧 System Components

### 1. **Frontend (React + TypeScript)**

#### a. `ChatBox.tsx`

- Real-time chat interface.
- Infinite scroll with lazy loading and scroll-to-bottom.
- Typing indicators and optimistic message updates.
- Integrates with WebSocket for message and typing events.

#### b. `WebRTCCallProvider.tsx`

- Manages:
    - Socket initialization
    - WebRTC connection lifecycle
    - Media device access
    - Global call state
    - Peer negotiation (offer/answer/candidate)
- Exposes context values used by hooks.

#### c. `useCall.ts`

- Hook for triggering and controlling call states:
    - `startCall`, `acceptCall`, `endCall`, etc.
    - Tracks call lifecycle flags (isCalling, isReceiving)
    - Emits local stream events via `Emitter`.

#### d. `CallWindow.tsx`

- UI for in-call experience.
- Displays local and remote video.
- Shows caller name, mute/video toggle, end call.
- Handles incoming stream updates from emitter.

#### e. `CallModal.tsx`

- Displays modal for incoming calls.
- Allows accept/reject with ringtone.
- Uses context and emits call events.

---

### 2. **Backend (Node.js + Socket.IO + MongoDB)**

#### a. **Socket Events**

- **Init/Join/Leave**: Track room/thread state.
- **Typing & Messaging**: Transmit real-time events.
- **Call Lifecycle**:
    - `rtc:offer`, `rtc:answer`, `rtc:ice-candidate`, `rtc:end`
    - Payloads include `to` and `from` (IUser)
- **Presence**:
    - `get_online_users`, `user_online`, `user_offline`
    - Based on room socket count.

#### b. **Call Forwarding**

```ts
[OFFER, ANSWER, ICE_CANDIDATE, END].forEach(event => {
  socket.on(event, ({ to, ...rest }) => {
    socket.to(to).emit(event, { ...rest, from: user });
  });
});
```

---

## 📦 Folder Structure

```bash
src/
├── components/
│   ├── CallModal.tsx
│   └── CallWindow.tsx
├── context/
│   └── WebRTCCallProvider.tsx
├── hooks/
│   └── useCall.ts
├── socket/
│   └── socketClient.ts
├── webrtc/
│   ├── MediaDevice.ts
│   ├── PeerConnection.ts
│   └── Emitter.ts
├── pages/
│   └── SupportChatPage.tsx
```

---

## 🔁 Key Data Flow

```
[User A] → startCall() → WebRTCCallProvider → PeerConnection.createOffer()
                   ↓
         Socket.IO emit(offer, { to, from })

[User B] ← offer ← socket.on('offer') → set isReceiving
         → display CallModal
         → on accept → createAnswer() and emit

Both parties:
- exchange ICE candidates
- display video via MediaStreams
```

---

## 🔐 Authentication

- JWT is passed in `auth.token` during `initSocket()`.
- Backend validates with middleware and maps socket to user.

---

## 🧪 Additional Features

- Optimistic message rendering.
- Ringtone on incoming call.
- Scroll restoration on new messages.
- Live presence via socket room count.
- Call duration timer (optional).

---

## 🏁 Deployment Notes

- Requires HTTPS for WebRTC.
- TURN server may be needed for NAT traversal.
- WebSocket reconnection and error handling recommended.

---

## 📌 Future Improvements

- Call recording
- Screen sharing
- Multiple participants
- Retry failed media device permissions
- Message read receipts


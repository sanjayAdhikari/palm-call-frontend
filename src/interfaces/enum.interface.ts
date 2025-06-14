export enum AppIconType {
  "AUDIO_CALL" = "AUDIO_CALL",
  "VIDEO_CALL" = "VIDEO_CALL",
  "EYE" = "EYE",
  "EYE_OFF" = "EYE_OFF",
  "HOME" = "HOME",
  "PARCEL" = "PARCEL",
  "LOCATION" = "LOCATION",
  "DOWN" = "DOWN",
  "WALLET" = "WALLET",
  "LOGISTICS" = "LOGISTICS",
  "ADD" = "ADD",
  "DOWNLOAD" = "DOWNLOAD",
  "WITHDRAW" = "WITHDRAW",
  "CLOSE_FILL" = "CLOSE_FILL",
  "CUSTOMER" = "CUSTOMER",
  "SEND" = "SEND",
  "USER" = "USER",
  "FILTER" = "FILTER",
  "REFUND" = "REFUND",
  "CLOSE" = "CLOSE",
  "VENDOR" = "VENDOR",
  "INFO" = "INFO",
  "BADGE" = "BADGE",
  "KYC" = "KYC",
  "MORE_MENU" = "MORE_MENU",
  "COMMODITY" = "COMMODITY",
  "RIGHT_ARROW" = "RIGHT_ARROW",
  "CONFIGURE" = "CONFIGURE",
  "DELIVERY_TYPE" = "DELIVERY_TYPE",
  "DISCOUNT" = "DISCOUNT",
  "NOTIFICATION" = "NOTIFICATION",
  "COUPON" = "COUPON",
  "REFERRAL" = "REFERRAL",
  "BACK" = "BACK",
  "CHECK" = "CHECK",
  "LOGOUT" = "LOGOUT",
  "DOTS" = "DOTS",
  "DOT" = "DOT",
  "EDIT" = "EDIT",
  "DELETE" = "DELETE",
  "PRINT" = "PRINT",
  "ADD_BOX" = "ADD_BOX",
  "SEARCH" = "SEARCH",
  "GOOGLE" = "GOOGLE",
  "RECEIPT" = "RECEIPT",
  "WEIGHT" = "WEIGHT",
  "TRANSFER" = "TRANSFER",
  CHECK_CIRCLE = "CHECK_CIRCLE",
  RADIO_ON = "RADIO_ON",
  CHECK_FILL = "CHECK_FILL",
  CHECK_SQUARE = "CHECK_SQUARE",
  RADIO_OFF = "RADIO_OFF",
  SUPPORT = "SUPPORT",
  REFRESH = "REFRESH",
  COURIER_RATE = "COURIER_RATE",
}

export enum QueryNames {
  "EMAIL" = "email",
  "FROM" = "from",
  "TO" = "to",
  "DESTINATION" = "destination",
  "SOURCE" = "source",
  "TOKEN" = "token",
  "USER_TYPE" = "userType",
  "INACTIVE" = "inactive",
  "STATUS" = "status",
  "ID" = "id",
  "MESSAGE" = "message",
  ACTIVITY_ID = "activity_id",
  ORDER_ID = "order_id",
  THREAD_ID = "thread_id",
  RETURN_URL = "returnUrl",
}

export enum ParamsNames {
  "HASH" = "HASH",
  "ID" = "ID",
  "TYPE" = "TYPE",
}

export enum LocalStorageName {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

export enum UserType {
  USER = "USER",
  AGENT = "AGENT",
}

// export enum SocketEventEnum {
//   INIT = "init",
//   JOIN_THREAD = "thread:join",
//   LEAVE_THREAD = "thread:leave",
//   MESSAGE = "message",
//   START_TYPING = "typing:start",
//   STOP_TYPING = "typing:stop",
//   OFFER = "rtc:offer",
//   ANSWER = "rtc:answer",
//   END = "rtc:end",
//   ICE_CANDIDATE = "rtc:ice-candidate",
//   USER_ONLINE = "presence:user_online",
//   USER_OFFLINE = "presence:user_offline",
//   GET_ONLINE_USERS = "get_online_users",
//   ONLINE_USERS = "online_users",
//   ERROR = "error",
//   DISCONNECT = "disconnect",
//   CONNECT = "connect",
//   USER_SPEAKING = "USER_SPEAKING",
// }


export enum SocketEventEnum {
  INIT = "init",
  JOIN_THREAD = "join-thread",
  LEAVE_THREAD = "leave-thread",
  GET_ONLINE_USERS = "get-online-users",
  ONLINE_USERS = "online-users",
  USER_ONLINE = "user-online",
  USER_OFFLINE = "user-offline",
  MESSAGE = "message",
  START_TYPING = "start-typing",
  STOP_TYPING = "stop-typing",

  OFFER = "offer",
  ANSWER = "answer",
  ICE_CANDIDATE = "ice-candidate",
  END = "end",

  PUSH_TO_TALK = "push-to-talk",
  USER_SPEAKING = "user-speaking",

  ERROR = "error",

  // Mediasoup-specific
  GET_RTP_CAPABILITIES = "get-rtp-capabilities",
  CREATE_TRANSPORT = "create-transport",
  CONNECT_TRANSPORT = "connect-transport",

  PRODUCE = "produce",

  CREATE_RECV_TRANSPORT = "create-recv-transport",
  CONNECT_RECV_TRANSPORT = "connect-recv-transport",

  CONSUME = "consume",

  // Call session management
  CALL_START = "call:start",
  CALL_END = "call:end",
  CALL_ACTIVE = "call:active",

  DISCONNECT = "disconnect",
  CONNECT = "connect",
}

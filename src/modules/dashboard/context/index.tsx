import { Outlet } from "react-router-dom";
import ChatContextProvider, { ChatContext } from "./ChatContext";

export default function () {
  return (
    <ChatContextProvider>
      <Outlet />
    </ChatContextProvider>
  );
}

export { ChatContext };

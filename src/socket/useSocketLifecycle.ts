// hooks/useSocketLifecycle.ts
import { useAppContext } from "context";
import { useEffect } from "react";
import { getAccessToken } from "utils";
import { disconnectSocket, initSocket } from "./socketClient";

export const useSocketLifecycle = () => {
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    if (isAuthenticated) {
      const token = getAccessToken();
      console.log("socket connection initiated", token);
      initSocket(token);
    } else {
      console.log("socket connection disconnected");
      disconnectSocket(); // disconnect on logout
    }
  }, [isAuthenticated]);
};

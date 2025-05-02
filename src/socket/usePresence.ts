import { useEffect, useState } from "react";
import { getPresence, subscribeToPresence } from "./presenceStore";

export const usePresence = (userId: string) => {
  const [isOnline, setIsOnline] = useState(() => getPresence(userId));

  useEffect(() => {
    const update = () => {
      setIsOnline(getPresence(userId));
    };
    const unsubscribe = subscribeToPresence(update);
    return unsubscribe;
  }, [userId]);

  return isOnline;
};

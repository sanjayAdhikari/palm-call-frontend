type Listener = () => void;

const presenceMap = new Map<string, boolean>();
const listeners = new Set<Listener>();

export const setPresence = (userId: string, isOnline: boolean) => {
  presenceMap.set(userId, isOnline);
  listeners.forEach((cb) => cb());
};

export const getPresence = (userId: string) => {
  return presenceMap.get(userId) ?? false;
};

export const subscribeToPresence = (cb: Listener) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const setAllOnline = (userIds: string[]) => {
  userIds.forEach((id) => presenceMap.set(id, true));
  listeners.forEach((cb) => cb());
};

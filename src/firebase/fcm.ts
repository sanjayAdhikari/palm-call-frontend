import { deleteToken, getToken, messaging, onMessage } from "./index";

const VAPID_KEY = import.meta.env.VITE_APP_VAPID_KEY as string; // from Firebase Console > Project Settings > Cloud Messaging
console.log("VAPID_KEY", VAPID_KEY);

export async function requestFCMPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    console.log("permission", messaging);
    if (permission !== "granted") return null;

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });
    return currentToken || null;
  } catch (err) {
    console.error("FCM permission error", err);
    return null;
  }
}

export function onFCMMessage(callback: (payload: any) => void) {
  onMessage(messaging, callback);
}

export async function revokeFCMToken(): Promise<void> {
  try {
    await deleteToken(messaging);
  } catch (err) {
    console.error("Failed to delete FCM token", err);
  }
}

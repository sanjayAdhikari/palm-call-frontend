importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js",
);

const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: "1018407036771",
  appId: true,
};

firebase.initializeApp(defaultConfig);
// BKiT-isBz5ZUEEHRzIrxye_x_Z9_0vy_WIK7at6uXnPJZSE6Sx-kmVaEjNfXQPBPpYu4d_WvfndD339B66m5OxE
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload,
  );
  const { title, body, imageUrl } = payload.notification;
  console.log(
    "self.registration.showNotification",
    self.registration.showNotification,
  );
  await self.registration.showNotification(title, {
    body,
    icon: "/logo.jpg",
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const link = event.notification.data?.link;
  if (link) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === link && "focus" in client) {
              return client.focus();
            }
          }
          return clients.openWindow(link);
        }),
    );
  }
});

import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./app";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service worker registered:", registration);
    })
    .catch((err) => {
      console.error("Service worker registration failed:", err);
    });
}

root.render(
  <BrowserRouter>
    <ConfigProvider>
      <ToastContainer />
      <App />
    </ConfigProvider>
  </BrowserRouter>,
);

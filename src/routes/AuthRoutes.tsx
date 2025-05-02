import { NotFoundComponent } from "components";
import { PageLinks } from "constant";
import { useAppContext } from "context";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { Api } from "services";
import { onFCMMessage, requestFCMPermission } from "../firebase/fcm";

import { AuthenticationRoute, DashboardRoute, SetupRoute } from "../modules";
import CallModal from "../webRTC/CallModal";
import CallWindow from "../webRTC/CallWindow";
import { WebRTCCallProvider } from "../webRTC/WebRTCCallProvider";

export default function AuthRoute() {
  const location = useLocation();
  return (
    <AnimatePresence mode={"wait"}>
      <Routes key={location?.pathname}>
        <Route path="/" element={<PublicRouteComponent />}>
          {AuthenticationRoute()}
        </Route>
        <Route path="/" element={<PrivateRouteComponent />}>
          {SetupRoute()}
          {DashboardRoute()}
        </Route>
        <Route path={"*"} element={<NotFoundComponent />} />
      </Routes>
    </AnimatePresence>
  );
}

function PrivateRouteComponent() {
  const { isAuthenticated, isAuthenticating } = useAppContext();

  const { postApi } = Api();

  const isRequestingRef = useRef(false);

  useEffect(() => {
    let toastID;
    if (isAuthenticated) {
      if (Notification.permission === "default") {
        toastID = toast.info("Click here to enable notifications", {
          autoClose: false,
          closeOnClick: false,
          onClick: async () => {
            const token = await syncFCMToken();
            if (token) {
              toast.dismiss(toastID);
              toast.success("Notifications enabled!");
            }
          },
        });
      }

      onFCMMessage((payload) => {
        toast.info(
          `${payload?.notification?.title}: ${payload?.notification?.body}`,
          {
            position: "top-right",
            autoClose: 5000,
            icon: IoNotifications,
          },
        );
      });
    }
    const syncFCMToken = async () => {
      if (isRequestingRef.current) return;
      isRequestingRef.current = true;

      const token = await requestFCMPermission();
      if (token) {
        await postApi("/api/v1/user/fcm", {
          token,
        });
      }
      return token;
    };

    return () => {
      if (toastID) {
        toast.dismiss(toastID);
      }
    };
  }, [isAuthenticated]);

  const canAccess = isAuthenticated;
  if (isAuthenticating) return <></>;
  return canAccess ? (
    <WebRTCCallProvider>
      <Outlet />
      <CallWindow />
      <CallModal />
    </WebRTCCallProvider>
  ) : (
    <Navigate to={PageLinks.auth.login} replace />
  );
}

function PublicRouteComponent() {
  const { isAuthenticated, isAuthenticating } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PageLinks.dashboard.chat, {
        replace: true,
      });
    }
  }, [isAuthenticated]);
  if (isAuthenticating) return <></>;

  return !isAuthenticated ? <Outlet /> : <></>;
}

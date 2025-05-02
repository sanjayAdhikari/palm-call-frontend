import { NotFoundComponent } from "components";
import { PageLinks } from "constant";
import { useAppContext } from "context";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthenticationRoute, DashboardRoute, SetupRoute } from "../modules";
import { useSocketLifecycle } from "../socket/useSocketLifecycle";

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
  useSocketLifecycle();

  const { pathname } = useLocation();

  const canAccess = isAuthenticated;
  if (isAuthenticating) return <></>;
  return canAccess ? (
    <Outlet />
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

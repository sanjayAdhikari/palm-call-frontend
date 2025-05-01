import React, { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  SetupRoute,
  KYCRoute,
  DashboardRoute,
  AuthenticationRoute,
  VendorRoute,
  OrderRoute,
  WalletRoute,
} from "../modules";
import { useAppContext } from "context";
import { PageLinks } from "constant";
import { NotFoundComponent } from "components";
import { AnimatePresence } from "framer-motion";

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
          {KYCRoute()}
          {OrderRoute()}
          {VendorRoute()}
          {WalletRoute()}
        </Route>
        <Route path={"*"} element={<NotFoundComponent />} />
      </Routes>
    </AnimatePresence>
  );
}

function PrivateRouteComponent() {
  const { isAuthenticated, isAuthenticating } = useAppContext();
  const { pathname } = useLocation();
  const waybill = pathname.includes(PageLinks.activity.waybillDetails);

  const canAccess = waybill || isAuthenticated;
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
      navigate(PageLinks.dashboard.list, {
        replace: true,
      });
    }
  }, [isAuthenticated]);
  if (isAuthenticating) return <></>;

  return !isAuthenticated ? <Outlet /> : <></>;
}

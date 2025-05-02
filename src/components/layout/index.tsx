import { PageLinks } from "constant";
import { useAppContext } from "context";
import { useScreenSize } from "hooks";
import React from "react";
import { useLocation } from "react-router-dom";
import NavComponent from "./NavComponent";

function Index({ children }) {
  const { isAuthenticated } = useAppContext();
  const {
    size: { height },
  } = useScreenSize();
  const { pathname } = useLocation();
  const allowedPages = [PageLinks.dashboard.chat, PageLinks.dashboard.more];
  const { isSmScreen } = useScreenSize();
  const showNav =
    (allowedPages.some((e) => e.includes(pathname)) || !isSmScreen) &&
    isAuthenticated;
  return (
    <div
      style={{
        height: `${height}px`,
      }}
      className={`w-screen overflow-y-scroll hide-scrollbar grid ${
        showNav
          ? " sm:grid-cols-[100px_auto] sm:grid-rows-1 grid-rows-[auto_80px] col"
          : ""
      }`}
    >
      {showNav && <NavComponent />}
      <div
        className={
          "h-full overflow-y-scroll sm:order-last order-first hide-scrollbar sm:px-5 px-2 sm:py-5 py-2"
        }
      >
        {children}
      </div>
    </div>
  );
}

export default Index;

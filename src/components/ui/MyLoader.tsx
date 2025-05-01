import React from "react";
import { LoadingAnimation } from "components";

function MyLoader() {
  return (
    <div
      className={
        "fixed top-0 flex items-center justify-center h-screen w-screen bg-black/40 z-[99999]"
      }
    >
      <div className={"flex items-center flex-col gap-1"}>
        <div className={"loader"}></div>
        <span className={"text-gray-100 text-[12px]"}>Please wait...</span>
      </div>
    </div>
  );
}

export default MyLoader;

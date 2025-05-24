import HyreLoading from "assets/hyreLoading.webm";
import React from "react";

function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center">
      <video autoPlay loop muted playsInline className="w-32 h-32 rounded-xl">
        <source src={HyreLoading} type="video/webm" />
        <div className={"flex items-center flex-col gap-1"}>
          <div className={"loader"}></div>
          <span className={"text-gray-100 text-[12px]"}>Please wait...</span>
        </div>
      </video>
    </div>
  );
}

export default LoadingAnimation;

import React from "react";
import Logo from "assets/logo.jpg";
import { MyButton } from "components";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "constant";
function NotFoundComponent() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/*<div>*/}
      {/*  <img*/}
      {/*    src={Logo}*/}
      {/*    alt={"logo"}*/}
      {/*    className={"fixed top-10 left-10 w-[80px] rounded-md"}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">
          Oops! Page not found.
        </p>
        <p className="text-gray-500 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <MyButton
          variant={"outlined"}
          name={"Back to home"}
          onClick={() => navigate(PageLinks.dashboard.list)}
        />
      </div>
    </div>
  );
}

export default NotFoundComponent;

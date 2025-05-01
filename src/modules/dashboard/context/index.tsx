import KycContextProvider, { KycContext } from "./KycContext";
import { Outlet } from "react-router-dom";

export default function () {
  return (
    <KycContextProvider>
      <Outlet />
    </KycContextProvider>
  );
}

export { KycContext };

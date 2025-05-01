import { Outlet } from "react-router-dom";
import UserContextProvider, { UserContext } from "./UserContext";

export default function () {
  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  );
}

export { UserContext };

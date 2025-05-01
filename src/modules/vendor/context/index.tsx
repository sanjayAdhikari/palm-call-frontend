import CourierRateContextProvider, {
  CourierRateContext,
} from "./CourierRateContext";
import { Outlet } from "react-router-dom";

export default function () {
  return (
    <CourierRateContextProvider>
      <Outlet />
    </CourierRateContextProvider>
  );
}

export { CourierRateContext };

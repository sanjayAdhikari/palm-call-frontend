import { lazy } from "react";

const CustomerPage = lazy(() => import("./CustomerPage"));
const UserPage = lazy(() => import("./UserPage"));

export { CustomerPage, UserPage };

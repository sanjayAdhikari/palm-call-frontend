import { lazy } from "react";

const EditVendorPage = lazy(() => import("./EditVendorPage"));
const VendorPage = lazy(() => import("./VendorPage"));
const EditCourierRatePage = lazy(() => import("./EditCourierRatePage"));

export { VendorPage, EditVendorPage, EditCourierRatePage };

import { lazy } from "react";
import MyKycPage from "./MyKycPage";
import EditKycPage from "./EditKycPage";
import KYCDetailsPage from "./KYCDetailsPage";

const KYCPage = lazy(() => import("./KYCPage"));

export { KYCPage, MyKycPage, EditKycPage, KYCDetailsPage };

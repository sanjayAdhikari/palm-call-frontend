import { lazy } from "react";

const DeliveryTypePage = lazy(() => import("./DeliveryTypePage"));
const BadgePage = lazy(() => import("./BadgePage"));
const EditBadgePage = lazy(() => import("./EditBadgePage"));
const EditDeliveryTypePage = lazy(() => import("./EditDeliveryTypePage"));
const EditCouponPage = lazy(() => import("./EditCouponPage"));
const CouponPage = lazy(() => import("./CouponPage"));
const ReferralPage = lazy(() => import("./ReferralPage"));
const ApplyReferralsPage = lazy(() => import("./ApplyReferralsPage"));
const UserPage = lazy(() => import("./UserPage"));
const CustomerPage = lazy(() => import("./CustomerPage"));
const CommodityPage = lazy(() => import("./CommodityPage"));
const EditCommodityPage = lazy(() => import("./EditCommodityPage"));

export {
  CommodityPage,
  EditCommodityPage,
  CustomerPage,
  UserPage,
  EditCouponPage,
  CouponPage,
  DeliveryTypePage,
  EditDeliveryTypePage,
  BadgePage,
  EditBadgePage,
  ReferralPage,
  ApplyReferralsPage,
};

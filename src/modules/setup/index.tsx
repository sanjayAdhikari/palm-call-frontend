import React from "react";
import { Route } from "react-router-dom";
import {
  BadgePage,
  CouponPage,
  DeliveryTypePage,
  EditBadgePage,
  EditCouponPage,
  EditDeliveryTypePage,
  ReferralPage,
  ApplyReferralsPage,
  UserPage,
  CustomerPage,
  CommodityPage,
  EditCommodityPage,
} from "./pages";
import ContextProvider from "./context";
import { ParamsNames, UserType } from "interfaces";
import { AccessComponent, PageTransition } from "components";

function Index() {
  return (
      <Route
        path={`customers`}
        element={
          <CustomerPage />
        }
      />
  );
}

export default Index;

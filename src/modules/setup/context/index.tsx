import DeliveryTypeContextProvider, {
  DeliveryTypeContext,
} from "./DeliveryTypeContext";
import BadgeContextProvider, { BadgeContext } from "./BadgeContext";
import CouponContextProvider, { CouponContext } from "./CouponContext";
import ReferralContextProvider, { ReferralContext } from "./ReferralContext";
import UserContextProvider, { UserContext } from "./UserContext";
import CommodityContextProvider, { CommodityContext } from "./CommodityContext";
import { Outlet } from "react-router-dom";

export default function () {
  return (
    <DeliveryTypeContextProvider>
      <CouponContextProvider>
        <BadgeContextProvider>
          <ReferralContextProvider>
            <UserContextProvider>
              <CommodityContextProvider>
                <Outlet />
              </CommodityContextProvider>
            </UserContextProvider>
          </ReferralContextProvider>
        </BadgeContextProvider>
      </CouponContextProvider>
    </DeliveryTypeContextProvider>
  );
}

export {
  CommodityContext,
  DeliveryTypeContext,
  BadgeContext,
  CouponContext,
  ReferralContext,
  UserContext,
};

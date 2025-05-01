import React, { createContext, useState } from "react";
import { IOptionContext } from "./context.interface";
import { Api } from "services";
import { ApiUrl } from "constant";

export const OptionContext = createContext<IOptionContext>({
  optionObject: {
    deliveryTypeObject: {},
    badgeObject: {},
    vendorObject: {},
    commodityObject: {},
    couponObject: {},
  },
  options: {
    badges: [],
    vendors: [],
    deliveryTypes: [],
    commodity: [],
    coupons: [],
    deliveryPartner: [],
  },
  handlers: {
    async getDeliveryPartnerOptions() {},
    async getCouponOptions() {},
    async getDeliveryTypeOptions() {},
    async getBadgeOptions() {},
    async getVendorOptions() {},
    async getCommodityOptions() {},
  },
});

export default function OptionContextProvider({ children }) {
  const [deliveryPartner, setDeliveryPartner] = useState([]);
  const [badges, setBadge] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [commodity, setCommodity] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [couponObject, setCouponObject] = useState({});
  const [commodityObject, setCommodityObject] = useState({});
  const [badgeObject, setBadgeObject] = useState({});
  const [vendorObject, setVendorObject] = useState({});
  const [deliveryTypeObject, setDeliveryTypeObject] = useState({});

  const { getApi } = Api();
  // Handlers
  const handlers = {
    async getDeliveryPartnerOptions() {
      try {
        const res = await getApi(ApiUrl.vendor.get_deliveryPartner);
        const lists = res?.data?.docs;
        setDeliveryPartner(lists);
      } catch (err) {
      } finally {
      }
    },
    async getDeliveryTypeOptions() {
      try {
        const res = await getApi(ApiUrl.deliveryType.get_lists);
        const lists = res?.data?.docs;
        setDeliveryTypes(lists);

        let object = {};
        lists?.forEach((e) => {
          object[e?._id] = e;
        });
        setDeliveryTypeObject(object);
      } catch (err) {
      } finally {
      }
    },
    async getBadgeOptions() {
      try {
        const res = await getApi(ApiUrl.badge.get_lists);
        const lists = res?.data?.docs;
        setBadge(lists);

        let object = {};
        lists?.forEach((e) => {
          object[e?._id] = e;
        });
        setBadgeObject(object);
      } catch (err) {
      } finally {
      }
    },
    async getCouponOptions() {
      try {
        const res = await getApi(ApiUrl.coupon.get_lists);
        const lists = res?.data?.docs;
        setCoupons(lists);

        let object = {};
        lists?.forEach((e) => {
          object[e?._id] = e;
        });
        setCouponObject(object);
      } catch (err) {
      } finally {
      }
    },
    async getVendorOptions() {
      try {
        const res = await getApi(ApiUrl.vendor.get_lists);
        const lists = res?.data?.docs;
        setVendors(lists);

        let object = {};
        lists?.forEach((e) => {
          object[e?._id] = e;
        });
        setVendorObject(object);
      } catch (err) {
      } finally {
      }
    },
    async getCommodityOptions() {
      try {
        const res = await getApi(ApiUrl.commodity.get_lists);
        const lists = res?.data;
        setCommodity(lists);

        let object = {};
        lists?.forEach((e) => {
          object[e?._id] = e;
        });
        setCommodityObject(object);
      } catch (err) {
      } finally {
      }
    },
  };

  return (
    <OptionContext.Provider
      value={{
        optionObject: {
          badgeObject,
          vendorObject,
          deliveryTypeObject,
          commodityObject,
          couponObject,
        },
        options: {
          badges,
          vendors,
          deliveryTypes,
          commodity,
          coupons,
          deliveryPartner,
        },
        handlers,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
}

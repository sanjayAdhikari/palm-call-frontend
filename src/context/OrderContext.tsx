import { createContext } from "react";
import {
  IBidding,
  ICallbackFunction,
  IContext,
  IFreightCharge,
  IOrder,
  IPaginateData,
  PackageStatusEnum,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";
import { Api } from "services";
import { string } from "yup";

interface IOrderContext extends IContext<IPaginateData<IOrder>, IOrder> {
  isBiddingLoading: boolean;
  isWaybillDetailsLoading: boolean;
  biddingLists: Partial<IBidding>[];
  waybillDetails?: IOrder;
  getWaybillDetails(waybill: string): Promise<void>;
  getBiddingHandler(
    srcCountry: string,
    destCountry: string,
    weight: number,
  ): Promise<any>;
  getBillDetailsHandler(query?: any): Promise<Partial<IFreightCharge>>;
  requestOrderHandler?(payload: any, cb?: ICallbackFunction): Promise<void>;
  receiveCashPayment?(payload: any, cb?: ICallbackFunction): Promise<void>;
  createFITOrderHandler?(payload: any, cb?: ICallbackFunction): Promise<void>;
  processOrderAction?(
    id: string,
    status: PackageStatusEnum,
    payload: any,
    cb?: ICallbackFunction,
  ): Promise<void>;
}

export const OrderContext = createContext<IOrderContext>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,
  biddingLists: [],
  isBiddingLoading: false,
  isWaybillDetailsLoading: false,
  waybillDetails: undefined,
  currentPage: 1,
  async getWaybillDetails(waybill) {},
  async getBiddingHandler(srcCountry, destCountry, weight) {},
  async editHandler(payload, cb) {},
  async requestOrderHandler(payload, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
  async toggleVisibility(id, visibilityStatus, cb) {},
  async deleteHandler(id, cb) {},
  async receiveCashPayment(payload, cb) {},
  async getBillDetailsHandler() {
    return {};
  },
  async processOrderAction(id, status, payload, cb) {},
});

export default function ContextProvider({ children }) {
  const {
    isLoading,
    isDetailsLoading,
    getDetailsHandler,
    details,
    getListHandler,
    lists,
    editHandler,
    toggleVisibilityHandler,
    saveHandler,
    deleteHandler,
    currentPage,
  } = useContextData();
  const {
    isDetailsLoading: isWaybillDetailsLoading,
    getDetailsHandler: getWaybillDetails,
    details: waybillDetails,
  } = useContextData();
  const { getApi } = Api();

  const {
    isLoading: isBiddingLoading,
    getListHandler: getBiddingHandler,
    lists: biddingLists,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.package.get_list, {
        ...query,
        havePagination: true,
      });
    },
    async getWaybillDetails(waybill: string) {
      return getWaybillDetails(ApiUrl.package.get_wayBillDetails(waybill));
    },
    async getBillDetailsHandler(query?: any) {
      try {
        const res = await getApi(
          ApiUrl.userOrder.get_calculateCourierRate,
          query,
        );
        return res?.data;
      } catch (err) {
        return {};
      }
    },
    async getBiddingHandler(
      srcCountry: string,
      destCountry: string,
      weight: number,
    ) {
      return getBiddingHandler(
        ApiUrl.userOrder.get_bidList(srcCountry, destCountry, weight),
      );
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.package.get_details(id));
    },

    async editHandler(payload: any, cb: ICallbackFunction) {
      if (payload?._id) {
        return editHandler(ApiUrl.package.put_edit(payload?._id), payload, cb);
      } else {
        return saveHandler(ApiUrl.courierRate.post_save, payload, cb);
      }
    },
    async createFITOrderHandler(payload: any, cb: ICallbackFunction) {
      return saveHandler(ApiUrl.package.post_fit, payload, cb);
    },

    async receiveCashPayment(payload: any, cb: ICallbackFunction) {
      return editHandler(
        ApiUrl.package.put_receiveCashPayment(payload?._id),
        payload,
        cb,
      );
    },
    async requestOrderHandler(payload: any, cb: ICallbackFunction) {
      return saveHandler(ApiUrl.userOrder.post_requestOrder, payload, cb);
    },
    async processOrderAction(
      id: string,
      status: PackageStatusEnum,
      payload: any,
      cb?: ICallbackFunction,
    ) {
      let url = (() => {
        switch (status) {
          case PackageStatusEnum.SHIPMENT_ACCEPTED_HYRE:
            return ApiUrl.package.put_accept(id);
          case PackageStatusEnum.SHIPMENT_ACCEPTED_VENDOR:
            return ApiUrl.package.put_accept(id);
          case PackageStatusEnum.REJECTED_VENDOR:
            return ApiUrl.package.put_reject(id);
          case PackageStatusEnum.CANCELLED:
            return ApiUrl.package.put_reject(id);
          case PackageStatusEnum.REJECTED_HYRE:
            return ApiUrl.package.put_reject(id);
          case PackageStatusEnum.SHIPMENT_PICKUP_ASSIGN:
            return ApiUrl.package.put_assignPickup(id);
          case PackageStatusEnum.SHIPMENT_DELIVERED:
            return ApiUrl.package.put_markDelivered(id);
          default:
            return ApiUrl.package.put_changeStatus(id);
        }
      })();
      return editHandler(url, payload, cb);
    },

    async toggleVisibility(
      id: string,
      visibilityStatus: boolean,
      cb: ICallbackFunction,
    ) {
      return toggleVisibilityHandler(
        ApiUrl.courierRate.put_toggleVisibility(id, visibilityStatus),
        cb,
      );
    },
    async deleteHandler(id: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.courierRate.delete_remove(id), cb);
    },
  };
  return (
    <OrderContext.Provider
      value={{
        isWaybillDetailsLoading,
        waybillDetails,
        isDetailsLoading,
        isLoading,
        lists,
        currentPage,
        details,
        isBiddingLoading,
        biddingLists,
        ...Handlers,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

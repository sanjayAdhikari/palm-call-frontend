import { createContext } from "react";
import {
  ICallbackFunction,
  IContext,
  IPaginateData,
  IActivity,
  IGetApiQuery,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";
import { string } from "yup";

interface IActivityContext
  extends IContext<IPaginateData<IActivity>, IActivity> {
  applyCouponHandler(
    activityId: string,
    couponCode: string,
    cb: ICallbackFunction,
  ): Promise<void>;
  revokeCouponHandler(activityId: string, cb: ICallbackFunction): Promise<void>;
  editTimelineHandler(
    activityId: string,
    timelineId: string,
    payload: any,
    cb: ICallbackFunction,
  ): Promise<void>;
}

export const ActivityContext = createContext<IActivityContext>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,
  currentPage: 1,
  async editHandler(payload, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
  async toggleVisibility(id, visibilityStatus, cb) {},
  async deleteHandler(id, cb) {},
  async applyCouponHandler(activityId, couponCode, cb) {},
  async revokeCouponHandler(activityId, cb) {},
  async editTimelineHandler(activityId, timelineId, payload, cb) {},
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
    saveHandler,
    currentPage,
    deleteHandler,
  } = useContextData();

  const Handlers = {
    async getListHandler(query: IGetApiQuery) {
      return getListHandler(ApiUrl.activity.get_list, {
        ...query,
        havePagination: true,
      });
    },

    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.activity.get_details(id));
    },
    async applyCouponHandler(
      activityId: string,
      couponCode: string,
      cb: ICallbackFunction,
    ) {
      return editHandler(
        ApiUrl.activity.put_applyCoupon(activityId, couponCode),
        undefined,
        cb,
      );
    },
    async revokeCouponHandler(activityId: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.activity.delete_revokeCoupon(activityId), cb);
    },
    async editTimelineHandler(
      activityId: string,
      timelineId: string,
      payload: any,
      cb: ICallbackFunction,
    ) {
      return editHandler(
        ApiUrl.activity.put_timeline(activityId, timelineId),
        payload,
        cb,
      );
    },
    async editHandler(payload: any, cb: ICallbackFunction) {
      if (payload?._id) {
        return editHandler(ApiUrl.courierRate.put_update, payload, cb);
      } else {
        return saveHandler(ApiUrl.courierRate.post_save, payload, cb);
      }
    },

    async deleteHandler(id: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.courierRate.delete_remove(id), cb);
    },
  };
  return (
    <ActivityContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        currentPage,
        ...Handlers,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

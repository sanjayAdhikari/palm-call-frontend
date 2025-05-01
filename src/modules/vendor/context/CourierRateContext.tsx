import { createContext } from "react";
import {
  ICallbackFunction,
  IContext,
  ICourierRate,
  IPaginateData,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

interface ICourierRateContext
  extends IContext<IPaginateData<ICourierRate>, ICourierRate> {
  cloneRateSlapHandler(payload: any, cb: ICallbackFunction): Promise<void>;
}
export const CourierRateContext = createContext<ICourierRateContext>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,

  async editHandler(payload, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
  async cloneRateSlapHandler(payload, cb) {},
  async toggleVisibility(id, visibilityStatus, cb) {},
  async deleteHandler(id, cb) {},
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
  } = useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.courierRate.get_lists(query?.vendor));
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.courierRate.get_details(id));
    },

    async editHandler(payload: any, cb: ICallbackFunction) {
      if (payload?._id) {
        return editHandler(ApiUrl.courierRate.put_update, payload, cb);
      } else {
        return saveHandler(ApiUrl.courierRate.post_save, payload, cb);
      }
    },
    async cloneRateSlapHandler(payload: any, cb: ICallbackFunction) {
      return saveHandler(ApiUrl.courierRate.post_clone, payload, cb);
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
    <CourierRateContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </CourierRateContext.Provider>
  );
}

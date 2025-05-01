import { createContext } from "react";
import {
  ICallbackFunction,
  IContext,
  IDeliveryType,
  IPaginateData,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

export const DeliveryTypeContext = createContext<
  IContext<IPaginateData<IDeliveryType>, IDeliveryType>
>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,

  async editHandler(payload, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
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
      return getListHandler(ApiUrl.deliveryType.get_lists, query);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.deliveryType.get_details(id));
    },

    async editHandler(payload: any, cb: ICallbackFunction) {
      if (payload?._id) {
        return editHandler(ApiUrl.deliveryType.put_update, payload, cb);
      } else {
        return saveHandler(ApiUrl.deliveryType.post_save, payload, cb);
      }
    },
    async toggleVisibility(
      id: string,
      visibilityStatus: boolean,
      cb: ICallbackFunction,
    ) {
      return toggleVisibilityHandler(
        ApiUrl.deliveryType.put_toggleVisibility(id, visibilityStatus),
        cb,
      );
    },
    async deleteHandler(id: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.deliveryType.delete_remove(id), cb);
    },
  };
  return (
    <DeliveryTypeContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </DeliveryTypeContext.Provider>
  );
}

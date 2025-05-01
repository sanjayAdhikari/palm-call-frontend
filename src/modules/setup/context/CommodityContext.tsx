import { createContext } from "react";
import {
  IBadge,
  ICallbackFunction,
  ICommodity,
  IContext,
  IPaginateData,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

export const CommodityContext = createContext<
  IContext<ICommodity[], ICommodity>
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
      return getListHandler(ApiUrl.commodity.get_lists, query);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.commodity.get_details(id));
    },

    async editHandler(payload: any, cb: ICallbackFunction) {
      if (payload?._id) {
        return editHandler(ApiUrl.commodity.put_update, payload, cb);
      } else {
        return saveHandler(ApiUrl.commodity.post_save, payload, cb);
      }
    },
    async toggleVisibility(
      id: string,
      visibilityStatus: boolean,
      cb: ICallbackFunction,
    ) {
      return toggleVisibilityHandler(
        ApiUrl.commodity.put_toggleVisibility(id, visibilityStatus),
        cb,
      );
    },
    async deleteHandler(id: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.commodity.delete_remove(id), cb);
    },
  };
  return (
    <CommodityContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </CommodityContext.Provider>
  );
}

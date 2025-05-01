import { createContext } from "react";
import {
  ICallbackFunction,
  IConsignee,
  IContext,
  IPaginateData,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

export const ConsigneeContext = createContext<
  IContext<IPaginateData<IConsignee>, IConsignee>
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
      return getListHandler(ApiUrl.consignee.get_lists);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.consignee.get_details(id));
    },

    async editHandler(payload: any, cb: ICallbackFunction) {
      if (payload?._id) {
        return editHandler(ApiUrl.consignee.put_update, payload, cb);
      } else {
        return saveHandler(ApiUrl.consignee.post_save, payload, cb);
      }
    },
    async toggleVisibility(
      id: string,
      visibilityStatus: boolean,
      cb: ICallbackFunction,
    ) {
      return toggleVisibilityHandler(
        ApiUrl.consignee.put_toggleVisibility(id, visibilityStatus),
        cb,
      );
    },
    async deleteHandler(id: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.consignee.delete_remove(id), cb);
    },
  };
  return (
    <ConsigneeContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </ConsigneeContext.Provider>
  );
}

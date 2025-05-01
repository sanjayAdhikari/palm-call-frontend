import { createContext } from "react";
import {
  ICallbackFunction,
  IContext,
  IPaginateData,
  IWalletRefund,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

interface IAcceptRejectPayload {
  id: string;
  type: "accept" | "reject";
  remarks: string;
  amount: number;
}
interface IRefundContext
  extends IContext<IPaginateData<IWalletRefund>, IWalletRefund> {
  acceptRejectHandler(
    payload: IAcceptRejectPayload,
    cb: ICallbackFunction,
  ): Promise<void>;
}
export const RefundContext = createContext<IRefundContext>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,

  async editHandler(payload, cb) {},
  async acceptRejectHandler(payload, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
});

export default function ContextProvider({ children }) {
  const {
    isLoading,
    isDetailsLoading,
    getDetailsHandler,
    details,
    getListHandler,
    lists,
    saveHandler,
    editHandler,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.refund.get_list, query);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.refund.get_details(id));
    },

    async acceptRejectHandler(
      payload: IAcceptRejectPayload,
      cb: ICallbackFunction,
    ) {
      return editHandler(
        payload?.type === "accept"
          ? ApiUrl.refund.put_approve(payload?.id)
          : ApiUrl.refund.put_reject(payload?.id),
        payload,
        cb,
      );
    },
  };
  return (
    <RefundContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </RefundContext.Provider>
  );
}

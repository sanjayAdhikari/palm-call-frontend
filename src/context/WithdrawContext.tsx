import { createContext } from "react";
import {
  ICallbackFunction,
  IContext,
  IPaginateData,
  IWithdraw,
  IWithdrawAccount,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

interface IAcceptRejectPayload {
  id: string;
  type: "accept" | "reject";
  remarks: string;
  amount: number;
  proofOfPayment: string[];
}
interface IWithdrawContext
  extends IContext<IPaginateData<IWithdraw>, IWithdraw> {
  isWithdrawAccountLoading: boolean;
  withdrawAccount: IWithdrawAccount;
  getWithdrawAccountHandler(): Promise<void>;
  saveWithdrawAccountHandler(
    payload: any,
    cb: ICallbackFunction,
  ): Promise<void>;
  acceptRejectHandler(
    payload: IAcceptRejectPayload,
    cb: ICallbackFunction,
  ): Promise<void>;
}
export const WithdrawContext = createContext<IWithdrawContext>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,
  withdrawAccount: undefined,
  isWithdrawAccountLoading: false,
  async saveWithdrawAccountHandler(payload, cb) {},
  async getWithdrawAccountHandler() {},

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
  const {
    isDetailsLoading: isWithdrawAccountLoading,
    getDetailsHandler: getWithdrawAccountHandler,
    details: withdrawAccount,
    saveHandler: saveWithdrawAccountHandler,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.withdraw.get_list, query);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.withdraw.get_details(id));
    },
    async getWithdrawAccountHandler() {
      return getWithdrawAccountHandler(ApiUrl.withdraw.get_account);
    },
    async saveWithdrawAccountHandler(payload: any, cb: ICallbackFunction) {
      return saveWithdrawAccountHandler(
        ApiUrl.withdraw.post_account,
        payload,
        cb,
      );
    },
    async editHandler(value: any, cb: ICallbackFunction) {
      return saveHandler(ApiUrl.withdraw.post_requestWithdraw, value, cb);
    },
    async acceptRejectHandler(
      payload: IAcceptRejectPayload,
      cb: ICallbackFunction,
    ) {
      return editHandler(
        payload?.type === "accept"
          ? ApiUrl.withdraw.put_approve(payload?.id)
          : ApiUrl.withdraw.put_reject(payload?.id),
        payload,
        cb,
      );
    },
  };
  return (
    <WithdrawContext.Provider
      value={{
        isWithdrawAccountLoading,
        withdrawAccount,
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </WithdrawContext.Provider>
  );
}

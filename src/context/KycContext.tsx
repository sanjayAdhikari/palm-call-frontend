import { createContext } from "react";
import { ICallbackFunction, IContext, IPaginateData } from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";
import { IKyc } from "interfaces";

interface IKyContext extends IContext<IPaginateData<IKyc>, IKyc> {
  myKyc: IKyc;
  isMyKycLoading: boolean;
  getMyKycHandler(query?: any): Promise<void>;
  updateKYCStatus(payload: any, cb?: ICallbackFunction): Promise<void>;
}
export const KycContext = createContext<IKyContext>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  myKyc: undefined,
  isMyKycLoading: false,
  currentPage: 1,
  isDetailsLoading: false,
  async getMyKycHandler(query) {},
  async editHandler(payload, cb) {},
  async updateKYCStatus(payload, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
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
    saveHandler,
    currentPage,
  } = useContextData();
  const {
    details: myKyc,
    getDetailsHandler: getMyKycHandler,
    isDetailsLoading: isMyKycLoading,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.kyc.get_lists, query);
    },
    async getMyKycHandler(query?: any) {
      return getMyKycHandler(ApiUrl.kyc.get_my, query);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.kyc.get_details(id));
    },

    async editHandler(payload: any, cb: ICallbackFunction) {
      if (payload?._id) {
        return editHandler(ApiUrl.kyc.put_update, payload, cb);
      } else {
        return saveHandler(ApiUrl.kyc.post_save, payload, cb);
      }
    },
    async updateKYCStatus(payload: any, cb: ICallbackFunction) {
      return editHandler(
        ApiUrl.kyc.put_updateStatus(payload?._id),
        payload,
        cb,
      );
    },
  };
  return (
    <KycContext.Provider
      value={{
        myKyc,
        isMyKycLoading,
        isDetailsLoading,
        isLoading,
        lists,
        details,
        currentPage,
        ...Handlers,
      }}
    >
      {children}
    </KycContext.Provider>
  );
}

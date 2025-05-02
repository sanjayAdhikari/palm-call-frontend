import { ApiUrl } from "constant";
import { useContextData } from "hooks";
import { IContext, IGetApiQuery, IPaginateData, IUser } from "interfaces";
import { createContext } from "react";

export const CustomerContext = createContext<
  IContext<IPaginateData<IUser>, IUser>
>({
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
});

export default function ContextProvider({ children }) {
  const {
    isLoading,
    isDetailsLoading,
    getDetailsHandler,
    details,
    getListHandler,
    lists,
    currentPage,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: IGetApiQuery) {
      return getListHandler(ApiUrl.customers.get_lists, {
        ...query,
        havePagination: true,
      });
    },
    async getDetailsHandler(participantID: string) {
      return getDetailsHandler(
        ApiUrl.support.get_threadByParticipant(participantID),
      );
    },
  };
  return (
    <CustomerContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        currentPage,
        details,
        ...Handlers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

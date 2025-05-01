import { createContext } from "react";
import { IContext, IGetApiQuery, IPaginateData, IUser } from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

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
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.customers.get_details(id));
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

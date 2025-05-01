import { createContext } from "react";
import { IContext, IPaginateData, ITransaction } from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

export const TransactionContext = createContext<
  IContext<IPaginateData<ITransaction>, ITransaction>
>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,

  currentPage: 1,
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
    currentPage,
    lists,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.wallet.get_transaction, query);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.wallet.get_transactionDetails(id));
    },
  };
  return (
    <TransactionContext.Provider
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
    </TransactionContext.Provider>
  );
}

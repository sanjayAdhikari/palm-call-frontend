import { createContext } from "react";
import { IBadge, IContext, IPaginateData, IReferral } from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

export const ReferralContext = createContext<
  IContext<IPaginateData<IReferral>, IBadge>
>({
  isLoading: false,
  lists: undefined,

  async getListHandler(query) {},
});

export default function ContextProvider({ children }) {
  const { isLoading, isDetailsLoading, details, getListHandler, lists } =
    useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.referral.get_history, query);
    },
  };
  return (
    <ReferralContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
}

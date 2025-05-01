import { createContext } from "react";
import { ICallbackFunction } from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

interface IUtilityContext {
  applyReferralHandler(code: string, cb: ICallbackFunction): Promise<void>;
  editMyProfileHandler(payload: any, cb: ICallbackFunction): Promise<void>;
}
export const UtilityContext = createContext<IUtilityContext>({
  async applyReferralHandler(code, cb) {},
  async editMyProfileHandler(payload, cb) {},
});

export default function ContextProvider({ children }) {
  const { saveHandler, editHandler } = useContextData();

  const Handlers = {
    applyReferralHandler: async (code: string, cb: ICallbackFunction) => {
      return saveHandler(ApiUrl.referral.post_apply(code), {}, cb);
    },
    editMyProfileHandler: async (payload: any, cb: ICallbackFunction) => {
      return editHandler(ApiUrl.auth.put_editProfile, payload, cb);
    },
  };
  return (
    <UtilityContext.Provider
      value={{
        ...Handlers,
      }}
    >
      {children}
    </UtilityContext.Provider>
  );
}

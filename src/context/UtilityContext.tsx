import { ApiUrl } from "constant";
import { useContextData } from "hooks";
import { ICallbackFunction } from "interfaces";
import { createContext } from "react";

interface IUtilityContext {
  editMyProfileHandler(payload: any, cb: ICallbackFunction): Promise<void>;
}

export const UtilityContext = createContext<IUtilityContext>({
  async editMyProfileHandler(payload, cb) {},
});

export default function ContextProvider({ children }) {
  const { saveHandler, editHandler } = useContextData();

  const Handlers = {
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

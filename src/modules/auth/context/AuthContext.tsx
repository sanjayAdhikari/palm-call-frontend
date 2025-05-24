import { ApiUrl } from "constant";
import { useAppContext } from "context";
import { ICallbackFunction } from "interfaces";
import React, { createContext } from "react";
import { Outlet } from "react-router-dom";
import { Api } from "services";
import { setAccessToken } from "utils";

interface AuthContext {
  loginHandler(payload: any, cb: ICallbackFunction): Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  async loginHandler(payload, cb) {},
});

function AuthContextProvider() {
  const {
    handler: { setLoading, setError, getCurrentHandler },
  } = useAppContext();
  const { postApi } = Api();
  const Handlers = {
    async loginHandler(payload: any, cb: ICallbackFunction) {
      try {
        setLoading(true);
        const res = await postApi(ApiUrl.auth.post_login, payload);
        setAccessToken(res?.data?.accessToken);
        // setRefreshToken(res?.data?.refreshToken);
        await getCurrentHandler();
        if (typeof cb.onSuccess === "function") {
          await cb.onSuccess(res?.data);
        }
      } catch (err) {
        let message = err?.message;
        if (err?.data?.length > 0) {
          message = err?.data?.join(", ");
        }
        setError(message);

        if (typeof cb.onError === "function") {
          await cb.onError(err);
        }
      } finally {
        setLoading(false);
      }
    },
  };
  return (
    <AuthContext.Provider value={Handlers}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

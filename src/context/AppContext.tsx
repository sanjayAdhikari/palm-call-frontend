import React, { createContext, useContext, useReducer } from "react";
import {
  AppReducerActionEnum,
  IAppContext,
  IAppState,
} from "./context.interface";
import { Api } from "services";
import { ApiUrl, PageLinks } from "constant";
import { setAccessToken, setRefreshToken } from "utils";
import { useNavigate } from "react-router-dom";
import { UserType } from "interfaces";
const InitialState: IAppState = {
  isLoading: false,
  isAuthenticating: true,
  isAuthenticated: false,
  showWalletBalance: false,
  isError: false,
  error: null,
  isSuccess: false,
  successMessage: "",
  userDetails: null,
  count: {
    notificationCount: 0,
    threadCount: 0,
  },
};
const AppStateContext = createContext<IAppContext>({
  ...InitialState,
  handler: {
    setShowWalletBalance(state) {},
    setAuthenticated(state) {},
    setAuthenticating(state) {},
    setLoading(state) {},
    setError(message) {},
    setSuccess(message) {},
    async getCurrentHandler() {},
    async getCountHandler() {},
    logoutHandler: async (userRole) => {},
    clearError(): any {},
    clearSuccess(): any {},
  },
});

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, InitialState);
  const { getApi, deleteApi } = Api();
  const navigate = useNavigate();
  // Handlers
  const Handlers = {
    setLoading: (isLoading: boolean) => {
      dispatch({ type: AppReducerActionEnum.SET_LOADING, payload: isLoading });
    },
    setShowWalletBalance: (status: boolean) => {
      dispatch({
        type: AppReducerActionEnum.SET_SHOW_WALLET_BALANCE,
        payload: status,
      });
    },

    setAuthenticating: (isAuthenticating: boolean) => {
      dispatch({
        type: AppReducerActionEnum.SET_AUTHENTICATING,
        payload: isAuthenticating,
      });
    },

    setAuthenticated: (isAuthenticated: boolean) => {
      dispatch({
        type: AppReducerActionEnum.SET_AUTHENTICATED,
        payload: isAuthenticated,
      });
    },

    setError: (error: string) => {
      dispatch({ type: AppReducerActionEnum.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: AppReducerActionEnum.CLEAR_ERROR });
    },

    setSuccess: (message: string) => {
      dispatch({ type: AppReducerActionEnum.SET_SUCCESS, payload: message });
    },

    clearSuccess: () => {
      dispatch({ type: AppReducerActionEnum.CLEAR_SUCCESS });
    },

    setUserDetails: (userDetails: any) => {
      dispatch({
        type: AppReducerActionEnum.SET_USER_DETAILS,
        payload: userDetails,
      });
    },

    logout: () => {
      dispatch({ type: AppReducerActionEnum.LOGOUT });
    },
    getCountHandler: async () => {
      try {
        const res = await getApi(ApiUrl.auth.get_unReadCount);
        dispatch({ type: AppReducerActionEnum.SET_COUNT, payload: res?.data });
      } catch (err) {
      } finally {
      }
    },
    getCurrentHandler: async () => {
      try {
        Handlers?.setAuthenticating(true);
        const res = await getApi(ApiUrl.auth.get_currentProfile);
        Handlers.setUserDetails(res?.data);
        Handlers?.setAuthenticated(true);
      } catch (err) {
        // Handlers?.setError(err?.message);
        Handlers?.setAuthenticated(false);
        setAccessToken();
        setRefreshToken();
      } finally {
        Handlers?.setAuthenticating(false);
      }
    },
    logoutHandler: async (userRole?: UserType) => {
      try {
        Handlers?.setLoading(true);
        await deleteApi(ApiUrl.auth.delete_logout, undefined, {
          tokenType: "refresh",
        });
        Handlers?.logout();
        navigate(PageLinks.auth.logout(userRole));
      } catch (err) {
        Handlers?.setError(err?.message);
      } finally {
        setAccessToken();
        setRefreshToken();
        Handlers?.setLoading(false);
        Handlers?.setAuthenticated(false);
      }
    },
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        handler: Handlers,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

const reducer = (
  state: IAppState,
  action: { payload?: any; type: AppReducerActionEnum },
) => {
  switch (action.type) {
    case AppReducerActionEnum.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AppReducerActionEnum.SET_AUTHENTICATING:
      return { ...state, isAuthenticating: action.payload };
    case AppReducerActionEnum.SET_SHOW_WALLET_BALANCE:
      return { ...state, showWalletBalance: action.payload };
    case AppReducerActionEnum.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case AppReducerActionEnum.SET_ERROR:
      return { ...state, isError: true, error: action.payload };
    case AppReducerActionEnum.CLEAR_ERROR:
      return { ...state, isError: false, error: null };
    case AppReducerActionEnum.SET_SUCCESS:
      return { ...state, isSuccess: true, successMessage: action.payload };
    case AppReducerActionEnum.CLEAR_SUCCESS:
      return { ...state, isSuccess: false, successMessage: "" };
    case AppReducerActionEnum.SET_USER_DETAILS:
      return { ...state, userDetails: action.payload };
    case AppReducerActionEnum.SET_COUNT:
      return { ...state, count: action.payload };
    case AppReducerActionEnum.LOGOUT:
      return {
        ...InitialState,
        isAuthenticating: false,
      };
    default:
      return state;
  }
};

export const useAppContext = () => useContext(AppStateContext);
export default AppContextProvider;

import {
  IBadge,
  ICommodity,
  ICoupon,
  IDeliveryType,
  IUser,
  IVendor,
  UserType,
} from "interfaces";

export interface IAppState {
  isLoading: boolean;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  showWalletBalance: boolean;
  isError: boolean;
  error: string;
  isSuccess: boolean;
  successMessage: string;
  userDetails: IUser;
  count?: {
    notificationCount: number;
    threadCount: number;
  };
}

export interface IOptionContext {
  options: {
    vendors: IVendor[];
    badges: IBadge[];
    commodity: ICommodity[];
    deliveryTypes: IDeliveryType[];
    coupons: ICoupon[];
    deliveryPartner: IVendor[];
  };
  optionObject: {
    vendorObject: Record<string, IVendor>;
    badgeObject: Record<string, IBadge>;
    deliveryTypeObject: Record<string, IDeliveryType>;
    commodityObject: Record<string, ICommodity>;
    couponObject: Record<string, ICoupon>;
  };
  handlers: {
    getVendorOptions(): Promise<void>;
    getDeliveryPartnerOptions(): Promise<void>;
    getCouponOptions(): Promise<void>;
    getCommodityOptions(): Promise<void>;
    getBadgeOptions(): Promise<void>;
    getDeliveryTypeOptions(): Promise<void>;
  };
}
export interface IAppContext extends IAppState {
  handler: {
    setLoading(state: boolean): void;
    setShowWalletBalance(state: boolean): void;
    setAuthenticating(state: boolean): void;
    setAuthenticated(state: boolean): void;
    setError(message: string): void;
    setSuccess(message: string): void;
    getCurrentHandler(): Promise<void>;
    getCountHandler(): Promise<void>;
    logoutHandler(userRole?: UserType): Promise<any>;
    clearError(): any;
    clearSuccess(): any;
  };
}

export enum AppReducerActionEnum {
  SET_LOADING = "SET_LOADING",
  SET_COUNT = "SET_COUNT",
  SET_SHOW_WALLET_BALANCE = "SET_SHOW_WALLET_BALANCE",
  SET_AUTHENTICATING = "SET_AUTHENTICATING",
  SET_AUTHENTICATED = "SET_AUTHENTICATED",
  SET_ERROR = "SET_ERROR",
  LOGOUT = "LOGOUT",
  SET_USER_DETAILS = "SET_USER_DETAILS",
  CLEAR_SUCCESS = "CLEAR_SUCCESS",
  SET_SUCCESS = "SET_SUCCESS",
  CLEAR_ERROR = "CLEAR_ERROR",
}

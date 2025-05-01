import { ParamsNames, QueryNames, UserType } from "interfaces";

export const PageLinks = {
  customers: {
    list: "/customers",
  },
  dashboard: {
    list: "/dashboard",
    more: "/more",
  },
  notification: {
    list: "/notifications",
  },
  auth: {
    login: "/",
    loginOtpVerification: `/login/otp`,
    logout: (user: UserType) => `/?${QueryNames.USER_TYPE}=${user}`,
  },
};

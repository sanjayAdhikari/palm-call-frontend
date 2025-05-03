import { QueryNames, UserType } from "interfaces";

export const PageLinks = {
  customers: {
    list: "/customers",
  },
  dashboard: {
    chat: "/dashboard",
    details: (id: string) => `/dashboard?${QueryNames.ID}=${id}`, // for lg screen    details_new: (id: string) => `/order/activity/details/${id}`, // for sm screen
    details_new: (id: string) => `/dashboard/details?${QueryNames.ID}=${id}`, // for sm screen
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

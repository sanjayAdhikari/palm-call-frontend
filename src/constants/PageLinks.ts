import { ParamsNames, QueryNames, UserType } from "interfaces";

export const PageLinks = {
  users: {
    list: "/setup/users",
  },
  customers: {
    list: "/customers",
  },
  dashboard: {
    list: "/dashboard",
    userProfile: (userType: UserType, id: string) =>
      `/user/profile/${userType}/${id}`,
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

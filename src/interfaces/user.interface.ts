import { KycStatusEnum, UserType } from "./enum.interface";
import { IVendor } from "./cargo.interface";

export interface IUser {
  profileImage: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isSeed: boolean;
  kycStatus: KycStatusEnum;
  hasProfileSetup: boolean;
  name: string;
  phone: string;
  referralCode: string;
  userID: string;
  userType: UserType;
  username: string;
  _id: string;
  vendor?: IVendor;
}
export interface IAdminUser {
  _id: string;
  customer: IUser;
  role: {
    _id: string;
    userType: string;
    slug: string;
    name: string;
    isSeed: boolean;
    isActive: boolean;
  };
  isPrimaryUser: boolean;
  lastLoginAt: number;
}

export interface IAddress {
  street: string;
  city: string;
  county: string;
  postalCode: string;
}
export interface IConsignee {
  _id: string;
  name: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  photo: string;
  country: string;
  address: IAddress;
  geo?: {};
}

import { UserType } from "./enum.interface";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  profileImage: string;
  isEmailVerified: boolean;
  phone: string;
  userType: UserType;
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

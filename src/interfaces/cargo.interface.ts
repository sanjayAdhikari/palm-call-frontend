import { IAuditMetadata } from "./utils.interface";
import { CountryType, KycStatusEnum } from "./enum.interface";
import { IAddress } from "./user.interface";

export interface IDeliveryType extends IAuditMetadata {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  benefits?: string[];
}
export interface IBadge extends IAuditMetadata {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  benchmark?: string[];
}

export enum ServiceEnum {
  HYRE = "HYRE",
  HYRE_CARGO = "HYRE_CARGO",
  HYRE_DOMESTIC_LOGISTIC = "HYRE_DOMESTIC_LOGISTIC",
}
export enum VendorUserTypeEnum {
  INTERNATIONAL_CARGO_VENDOR = "vendor:international_cargo",
  DOMESTIC_LOGISTIC_VENDOR = "vendor:domestic_logistic",
}
export interface IVendor extends IAuditMetadata {
  vendorID?: string; //
  pan: {
    number: string;
    image: string;
    isVatRegistered: boolean;
    remarks: string;
  };
  ocr: {
    number: string;
    image: string;
    remarks: string;
  };
  ward: {
    number: string;
    image: string;
    remarks: string;
  };
  contract: {
    document: string;
    description: string;
  };
  address?: IAddress;
  isFeatured?: boolean;
  _id: string;
  service: ServiceEnum;
  vendorType: VendorUserTypeEnum;
  profileImage: string;
  name: string;
  legalName: string;
  logo: string;
  website: string;
  primaryEmail: string;
  phone: string;
  secondaryPhone: string;
  badge: IBadge;
  kycStatus: KycStatusEnum;
  taxClearance: string[];
}

export enum CourierRateType {
  "FLAT" = "FLAT",
  "PER_KG" = "PER_KG",
}
export interface ICourierRateCharge {
  freeHandlingCharge: boolean,
  minKG: number;
  maxKG: number;
  rateType: CourierRateType;
  charge: number;
  _id?: string;
  commission?: number;
}
export interface ICourierRate extends IAuditMetadata {
  _id: string;
  vendor: string;
  deliveryType: string;
  sourceCountry: CountryType;
  destinationCountry: CountryType;
  baseCharge: number;
  baseChargeCommission: number;
  isDox?: boolean;
  rateSlab: ICourierRateCharge[];
  benefits: string[]
}

export interface ICommodity extends IAuditMetadata {
  _id: string;
  parent: string;
  name: string;
  description?: string;
  tags: string[];
  isFragile: boolean;
  isSeed: boolean;
  child: ICommodity[];
  position: number;
  isDox?: boolean;
}

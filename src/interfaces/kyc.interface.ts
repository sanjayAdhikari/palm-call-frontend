import { KycStatusEnum } from "./enum.interface";

export enum GenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
export enum KycDocumentTypeEnum {
  "NONE" = "NONE",
  "CITIZENSHIP" = "CITIZENSHIP",
  "LICENSE" = "LICENSE",
  "NATIONAL_ID" = "NATIONAL_ID",
  "PASSPORT" = "PASSPORT",
  "VOTER_ID" = "VOTER_ID",
  "PAN" = "PAN",
}
export interface IKyc {
  _id: string;
  phone: string;
  legalName: string;
  profileImage: string;
  attemptedKYC: number;
  customer: string;
  gender: GenderEnum;
  dateOfBirth: Date;
  documentType: KycDocumentTypeEnum;
  documentNumber: string;
  frontImage: string;
  backImage: string;
  issuedPlace: string;
  issuedDate: Date;
  expiryDate: Date;
  status: KycStatusEnum;
  adminActionBy: string;
  adminRemarks: string;
  adminActionAt: Date;
}

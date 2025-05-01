import { IAuditMetadata } from "./utils.interface";
import { IUser } from "./user.interface";

export interface IReferral extends IAuditMetadata {
  _id: string;
  createdAt: Date;
  referredPoint: number;
  referredUser: IUser;
  referrerPoint: number;
  updatedAt: Date;
}

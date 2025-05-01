import {
  IFreightCharge,
  IOrderItems,
  IPackageCharge,
  IPackageInvoice,
  IShipper,
} from "./orders.interface";
import { IConsignee, IUser } from "./user.interface";
import { IDeliveryType, IVendor } from "./cargo.interface";
import { CountryType, PackageStatusEnum } from "./enum.interface";

export interface IActivityTimeline {
  status: PackageStatusEnum;
  actionBy: IUser;
  isVendor: boolean;
  actionAt: Date;
  remarks: string;
  location: string;
  disclaimer: string;
  images: string[];
  _id: string;
  timelineDate: Date;
}
export interface IPickupAgent {
  vendor?: IVendor;
  name: string;
  remarks: string;
  email: string;
  phone: string;
}
export interface IOrder {
  _id: string;
  activity: string;
  pickupTimeSlot?: string;
  shipper: Partial<IShipper>;
  consignee: IConsignee;
  pickupAgent: IPickupAgent;
  payment: Partial<IFreightCharge>;
  customer: IUser;
  vendor: IVendor;
  deliveryType: IDeliveryType;
  sourceCountry: CountryType;
  destinationCountry: CountryType;
  wayBillNumber: string;
  prefixCode: string;
  serialNumber: number;
  isFreightFinal: boolean;
  isSelfDrop: boolean;
  itemsCustomer: IOrderItems[];
  itemsVendor: IOrderItems[];
  totalChargeableWeight: number;
  specialInstructionByCustomer: string;
  status: PackageStatusEnum;
  timeline: IActivityTimeline[];
  invoice: IPackageInvoice;
  isFIT: boolean;
  isDelivered: boolean;
  isReturned: boolean;
  isCancelled: boolean;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // report
  charges: IPackageCharge[];

  // added fields for invoice and waybill
  bookedDate: Date;
  isDox: boolean;
  trackingID?: string;
  forwardingNumber?: string;
  serviceProvider?: string; // like DHL - DHL EXPRESS-EX LHR
  carrier?: string;
}

export interface IActivity {
  courier: {
    order: IOrder;
  };
  _id: string;
  customer: IUser;
  service: "HYRE_CARGO";
  activityID: string;
  vendor: IVendor;
  totalAmount: number;
  isDeleted: boolean;
  isActive: boolean;
  updatedAt: Date;
}

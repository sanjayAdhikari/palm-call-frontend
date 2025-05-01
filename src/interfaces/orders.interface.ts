import { CountryType, PackageStatusEnum } from "./enum.interface";
import {
  ICommodity,
  ICourierRateCharge,
  IDeliveryType,
  IVendor,
} from "./cargo.interface";
import { IConsignee, IUser } from "./user.interface";
import { IAuditMetadata, IPaginateData } from "./utils.interface";
import { IActivity, IOrder } from "./activity.interface";
import { ICoupon } from "./coupon.interface";

export interface IPackageCharge {
  title: string;
  description: string;
  amount: number;
}

export interface IPackageInvoiceItem {
  packageNumber: number;
  serialNumber: number;
  particular: string;
  HS_CODE: string;
  unitType: string;
  quantity: number;
  unitWeight: number; // in KG
  totalWeight: number;
  unitRate: number;
  amount: number;
}

export interface IPackageInvoice {
  invoiceNumber: string; // same as wayBillNumber
  invoiceDate: Date; // invoice date w.r.t invoice
  referenceNumber: number; // invoice number w.r.t invoice
  shipmentValue: number;
  invoiceType: string;
  currency: string;
  INCOTerms: string;
  note: string;
  items: IPackageInvoiceItem[];
  totalWeight: number;
  invoiceAmount: number;
}

export interface IOrderItems {
  _id: string;
  serialNumber: number; // 2/4 -> 1 , it indicates the item's serial
  commodity: ICommodity[];
  description?: string;
  length: number;
  breadth: number;
  height: number;
  weight: number;
  volumetricWeight: number; // from l,b,h
  chargeableWeight: number; // whichever is higher between weight & v.Weight
  quantityInBox: number;
  photo: string[];
  isHandleWithCare: boolean;
  remarks?: string;
}

export interface IShipper {
  phone: string;
  name: string;
  address: string;
  email: string;
  landmark: string;
}
export interface IUserPackageOrderPayload
  extends Omit<
    IOrder,
    | "vendor"
    | "pickupAgent"
    | "customer"
    | "deliveryType"
    | "wayBillNumber"
    | "prefixCode"
  > {
  vendor?: string;
  weight?: number;
  deliveryType: string;
  copyPackageToInvoice?: boolean; // copy value of invoice to package;
}

export interface IBiddingDeliveryOptions {
  deliveryType: IDeliveryType;
  rateSlab: ICourierRateCharge;
  baseCharge: number;
  freightCharge: number;
  totalCharge: number;
}

export interface IBidding {
  vendor: IVendor;
  distanceInLabel: number;
  currentAverageRating: number;
  totalRating: number;
  deliveryOptions: IBiddingDeliveryOptions;
  minCharge: number;
}

export interface IUniversalOrderPayment {
  vendorPayment: number;
  hyrePayment: number;
  orderAmount: number;
  couponDiscount: number;
  vendorBearsCouponDiscount: boolean;
  vendorAmountBeforeDiscount: number;
  hyreAmountBeforeDiscount: number;
}
export interface IFreightCharge extends IUniversalOrderPayment {
  rate?: {
    _id: string;
    vendor: string;
    deliveryType: string;
    sourceCountry: CountryType;
    destinationCountry: CountryType;
    baseCharge: number;
    rateSlab: ICourierRateCharge[];
    isDeleted: boolean;
    isActive: boolean;
  };
  paymentSource?: string;

  slab?: ICourierRateCharge;
  fitCharge: number;
  totalPackages: number;
  paidAt?: string;
  baseCharge: number;
  freightCharge: number;
  totalFreightCharge: number;
  commission: {
    totalBaseCharge: number;
    commissionOnWeight: number;
    totalCommission: number;
  };
  appliedCouponId?: ICoupon;
  hasPaid: boolean;
  proofOfReceipt: any[];
  remarks: string;
  couponDiscount: number;
  // advanceSettlement: number;
}

export const VALID_STATUS_TRANSITIONS: Record<
  PackageStatusEnum,
  { order: number }
> = {
  // Initial Inquiry & Order
  [PackageStatusEnum.SHIPMENT_QUERY]: {
    order: 1,
  },
  [PackageStatusEnum.SHIPMENT_ORDERED]: {
    order: 2,
  },

  // Acceptance and Booking
  [PackageStatusEnum.SHIPMENT_ACCEPTED_HYRE]: {
    order: 5,
  },
  [PackageStatusEnum.SHIPMENT_ACCEPTED_VENDOR]: {
    order: 6,
  },

  // Pickup and Warehousing
  [PackageStatusEnum.SHIPMENT_PICKUP_ASSIGN]: {
    order: 9,
  },
  [PackageStatusEnum.SHIPMENT_DROPPED]: {
    order: 10,
  },
  [PackageStatusEnum.SHIPMENT_BOOKED]: {
    order: 11,
  },
  [PackageStatusEnum.IN_WAREHOUSE_FACILITY]: {
    order: 12,
  },

  // Customs & Forwarding
  [PackageStatusEnum.SHIPMENT_DISPATCHED_TO_FORWARDER]: {
    order: 15,
  },
  [PackageStatusEnum.SHIPMENT_UNDER_CUSTOM_CLEARANCE]: {
    order: 16,
  },
  [PackageStatusEnum.SHIPMENT_IN_CUSTOMS_WAREHOUSE]: {
    order: 17,
  },
  [PackageStatusEnum.SHIPMENT_DEPARTED]: {
    order: 18,
  },

  // Transit
  [PackageStatusEnum.SHIPMENT_IN_TRANSIT]: {
    order: 21,
  },
  [PackageStatusEnum.SHIPMENT_DEPARTED_TRANSIT]: {
    order: 22,
  },

  // Destination Processing
  [PackageStatusEnum.SHIPMENT_ARRIVED_DESTINATION]: {
    order: 25,
  },
  [PackageStatusEnum.SHIPMENT_UNDER_DESTINATION_CUSTOMS_CLEARANCE]: {
    order: 26,
  },
  [PackageStatusEnum.SHIPMENT_IN_DESTINATION_WAREHOUSE]: {
    order: 27,
  },

  // Final Delivery Stages
  [PackageStatusEnum.OUT_FOR_DELIVERY]: {
    order: 30,
  },
  [PackageStatusEnum.SHIPMENT_DELIVERED]: { order: 31 },

  // Rejections and Cancellations
  [PackageStatusEnum.CANCELLED]: { order: -3 }, // End state
  [PackageStatusEnum.REJECTED_HYRE]: { order: -2 }, // End state
  [PackageStatusEnum.REJECTED_VENDOR]: { order: -1 }, // End state
};

//
export enum SupportChatStatusEnum {
  "OPEN" = "OPEN",
  "COMPLETED" = "COMPLETED",
  "ARCHIVED" = "ARCHIVED",
  "BLOCKED" = "BLOCKED",
}

export enum PriorityEnum {
  "LOW" = "LOW",
  "MEDIUM" = "MEDIUM",
  "HIGH" = "HIGH",
}

export interface ISupportChatAction {
  customer: string;
  remarks?: string;
  actionAt?: Date;
}
export interface ISupportThread extends IAuditMetadata {
  _id: string;
  activity: IActivity;
  participants: {
    customer: string;
    vendor?: string;
    hyreAdmins: boolean;
  };
  status: SupportChatStatusEnum;
  blockedBy?: ISupportChatAction;
  completionInfo?: ISupportChatAction;
  archivedBy?: ISupportChatAction;
  lastMessageAt?: Date;
  lastMessage: string;
  unreadCount?: {
    customer: number;
    vendor?: number;
    hyreAdmin?: number;
  };
  priority?: PriorityEnum; // Can be set by admin/vendor
}

export interface ISupportMessage extends IAuditMetadata {
  _id: string;
  supportThread: string;
  sender: IUser;
  message: string;
  attachments?: {
    url: string;
    fileName?: string;
  }[];
  systemGenerated?: boolean; // For automated messages like “Vendor marked thread completed”

  readBy: {
    customer?: Date;
    vendor?: Date;
    hyreAdmin?: Date;
  };
}

export interface ISupportChat {
  thread: ISupportThread;
  messages: IPaginateData<ISupportMessage>;
}

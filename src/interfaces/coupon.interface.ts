import { IAuditMetadata } from "./utils.interface";
import { IVendor, ServiceEnum } from "./cargo.interface";

export enum CouponDiscountTypeEnum {
  FLAT = "FLAT",
  PERCENTAGE = "PERCENTAGE",
}
export interface ICoupon extends IAuditMetadata {
  _id: string;
  title: string;
  code: string;
  vendor: IVendor[];
  forAllVendorUnderService: boolean;
  service: ServiceEnum;
  validFrom: Date;
  validUntil: Date;
  totalQuantity: number;
  availableQuantity: number;
  discount: number;
  perCustomerUsage: number;
  discountFromVendor: boolean; // vendor will liable if true else Hyre will burn the cash
  discountType: CouponDiscountTypeEnum;
  condition: {
    minimumSpendCondition: number; // only applicable if customer spend minimum X
    onlyOnFirstOrder: boolean; // only applicable if the customer applied for the first order
  };
}

import { IAuditMetadata } from "./utils.interface";
import { IUniversalOrderPayment, ServiceEnum } from "interfaces";
import { UserType } from "./enum.interface";
import { IUser } from "./user.interface";

export enum WalletOwnerTypeEnum {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  HYRE = "hyre",
}
export enum TransactionTypeEnum {
  DR = "DR",
  CR = "CR",
}
export enum LoadWalletServiceProvider {
  "ESEWA" = "ESEWA",
}

export enum PaymentThrough {
  "ESEWA" = "ESEWA",
  "HYRE_WALLET" = "HYRE_WALLET",
}
export enum TransactionCategoryEnum {
  SETTLEMENT = "SETTLEMENT",
  WALLET_LOAD_ESEWA = "WALLET_LOAD_ESEWA",
  WALLET_LOAD_KHALTI = "WALLET_LOAD_KHALTI",
  REFER_EARN = "REFER_EARN",
  REFUND = "REFUND",
  CARGO_FREIGHT_CHARGE = "CARGO_FREIGHT_CHARGE",
  CARGO_FINE = "CARGO_FINE",
}
export enum PaymentSourceEnum {
  WALLET = "WALLET",
  CASH = "CASH",
}
export interface IWallet extends IAuditMetadata {
  _id: string;
  ownerType: WalletOwnerTypeEnum;
  owner: string;
  availableBalance: number;
  unsettledBalance: number;
  lastBalanceAdded: number;
  lastBalanceAddedAt: Date;
}

export enum GeneralStatusEnum {
  PENDING = "PENDING",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
  AMBIGUOUS = "AMBIGUOUS",
}

export enum TransactionSettlementEnum {
  SETTLED = "SETTLED",
  UNSETTLED = "UNSETTLED",
}
export enum WithdrawMethodEnum {
  BANK = "BANK",
  ESEWA = "ESEWA",
  KHALTI = "KHALTI",
  QR = "QR",
}
export interface ITransaction extends IAuditMetadata {
  _id: string;
  uuid: string;
  paymentSource?: PaymentSourceEnum;
  transactionID: string;
  prefixCode: string;
  serialNumber: number;
  ownerType: WalletOwnerTypeEnum;
  owner: string;
  secondParty?: string;
  transactionType: TransactionTypeEnum;

  transactionCategory: TransactionCategoryEnum;
  activity?: string;
  amount: number;
  atm: {
    mainBalance: number;
  }; // at the moment
  description?: string;
  remarks?: string;
  service: ServiceEnum;
  transactionStatus: GeneralStatusEnum;
  settlementStatus: TransactionSettlementEnum;
}

export interface IWithdrawAccount {
  method: WithdrawMethodEnum;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  qrImage: string;
  mobileNumber: string;
  hasPendingRequest: boolean;
}
export interface IWithdraw extends IAuditMetadata {
  withdrawnTo: IWithdrawAccount;
  _id: string;
  ownerType: WalletOwnerTypeEnum;
  owner: IUser;
  requestedAmount: number;
  withdrawAmount: number;
  customerReason: string;
  adminRemarks: string;
  status: GeneralStatusEnum;
  requestedBy: string;
  atmBalance: number;
  hasSnooze: boolean;
  proofOfPayment: string[];
}

export enum RefundModeEnum {
  "AUTO_SYSTEM" = "AUTO_SYSTEM",
  "MANUAL_ADMIN" = "MANUAL_ADMIN",
}

export interface IWalletRefund extends IAuditMetadata {
  _id: string;
  ownerType: WalletOwnerTypeEnum;
  owner: IUser;
  activityID: string;
  paymentDetail: IUniversalOrderPayment;
  refundedAmount: number; // actual refunded amount (may differ from requested)
  remarks: string;
  status: GeneralStatusEnum;
  actionAt: Date;
  actionBy: string;
  requestedBy: string;
  atmBalance: number; // at the moment balance in wallet when admin approves or reject; after settlement
  refundMode: RefundModeEnum; // differentiates automated vs admin-initiated
  settlementTxnID?: string; // ref to wallet transaction if approved
  isFullRefunded: boolean;
}

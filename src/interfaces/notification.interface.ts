import { TransactionTypeEnum } from "./wallet.interface";

export enum NotificationCategoryEnum {
  POINT_EARNED = "POINT_EARNED",
  POINT_SPENT = "POINT_SPENT",
  REFERRAL = "referral",
  ORDER = "ORDER",
  THREAD = "THREAD",
  COUPON = "COUPON",
  SYSTEM = "system",
}

export interface INotification {
  _id: string;
  title: string;
  body: string;
  category: NotificationCategoryEnum;
  hasRead: boolean;
  createdAt: Date;
  payload?: {
    amount: number;
    id?: string;
    transactionCategory: string;
    transactionType: TransactionTypeEnum;
  };
}

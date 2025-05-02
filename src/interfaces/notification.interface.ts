export enum NotificationCategoryEnum {
  CHAT = "CHAT",
  SYSTEM = "system",
}

export interface INotification {
  _id: string;
  title: string;
  body: string;
  category: NotificationCategoryEnum;
  hasRead: boolean;
  createdAt: Date;
  payload?: any;
}

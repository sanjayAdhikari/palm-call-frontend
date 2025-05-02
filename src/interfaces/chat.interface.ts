import { IUser } from "./user.interface";
import { IAuditMetadata, IPaginateData } from "./utils.interface";

export enum SupportChatStatusEnum {
  "OPEN" = "OPEN",
  "COMPLETED" = "COMPLETED",
}

export interface ISupportThread extends IAuditMetadata {
  _id: string;
  participants: IUser[];
  status: SupportChatStatusEnum;
  lastMessageAt?: Date;
  lastMessage?: ISupportMessage;
  unreadCount?: {
    customer: string;
    count: number;
  }[];
}

export interface ISupportMessage extends IAuditMetadata {
  _id: string;
  thread: string;
  sender: IUser;
  message: string;
  attachments?: {
    url: string;
    fileName?: string;
    mimeType: string;
    size: number; // in bytes
    metadata?: string[];
  }[]; // For Future
  systemGenerated?: boolean; // For automated messages like “Vendor marked thread completed”
}

export interface ISupportChat {
  thread: ISupportThread;
  messages: IPaginateData<ISupportMessage>;
}

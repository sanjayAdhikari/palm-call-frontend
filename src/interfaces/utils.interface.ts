import { AppIconType, IDeliveryType, UserType } from "interfaces";
import type { TableColumnProps } from "antd";
import * as React from "react";

export interface INavigationItem {
  name: string; // Navigation title
  path?: string; // Page link
  icon?: AppIconType;
  showInMenu?: boolean; // show in tab; not inside more
  hideFromMenuInSmScreen?: boolean;
  canAccessBy?: UserType[] | UserType; // User role required for access
}

export interface ITableColumns<Type> extends TableColumnProps<Type> {}

interface SelectOptionType {
  disabled?: boolean;
  className?: string;
  title?: string;
  [name: string]: any;
}
export interface ISelectOption extends SelectOptionType {
  label?: string | React.ReactNode;
  value?: string | number | null;
  children?: Omit<SelectOptionType, "children">[];
}

export interface ICallbackFunction {
  onSuccess?: (res: any) => Promise<any>;
  onError?: (error: any) => Promise<any>;
}

export interface IPaginateData<T> {
  docs: T[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: undefined;
  nextPage: undefined;
}

export interface IContext<TList, TDetails> {
  lists?: TList;
  details?: TDetails;
  currentPage?: number;
  isLoading?: boolean;
  isDetailsLoading?: boolean;
  getListHandler?(query?: IGetApiQuery): Promise<void>;
  getDetailsHandler?(id: string | Record<string, string>): Promise<void>;
  editHandler?(payload: any, cb?: ICallbackFunction): Promise<void>;
  deleteHandler?(id: string, cb?: ICallbackFunction): Promise<void>;
  toggleVisibility?(
    id: string,
    visibilityStatus: any,
    cb?: ICallbackFunction,
  ): Promise<void>;
}

export interface IAuditMetadata {
  createdAt?: Date;
  isActive?: boolean;
  updatedAt?: Date;
}

export interface IGetApiQuery {
  havePagination?: boolean;
  pageSize?: number;
  page?: number;
  savePrevState?: boolean;
  [Key: string]: any;
}

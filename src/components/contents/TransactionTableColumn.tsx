import React from "react";
import { useScreenSize } from "hooks";
import {
  AppIconType,
  GeneralStatusEnum,
  ITableColumns,
  ITransaction,
  TransactionTypeEnum,
} from "interfaces";
import moment from "moment/moment";
import { capitalizeFirstLetter, commaSeparator, getIconsHandler } from "utils";

function TransactionTableColumn() {
  const { isSmScreen } = useScreenSize();
  const CheckIcon = getIconsHandler(AppIconType.CHECK);

  const TableColumns: ITableColumns<ITransaction>[] = [
    {
      title: "Transaction ID",
      hidden: isSmScreen,
      render: (value, record) => record?.transactionID,
    },
    {
      title: "Description",
      hidden: isSmScreen,
      render: (value, record) => <div>{record?.description}</div>,
    },
    {
      title: "Date",
      hidden: isSmScreen,
      render: (value, record) =>
        moment(record?.updatedAt).format("YYYY-MM-DD hh:mm A"),
    },
    {
      title: "Status",
      hidden: isSmScreen,
      render: (value, record) =>
        record?.transactionStatus === GeneralStatusEnum.DONE ? (
          <div className="flex items-center">
            <div className="bg-green-100 text-green-500 p-1 rounded-full text-xs">
              <CheckIcon />
            </div>
          </div>
        ) : (
          <span>{capitalizeFirstLetter(record?.transactionStatus)}</span>
        ),
    },
    {
      title: "DR.",
      hidden: isSmScreen,
      render: (value, record) =>
        record?.transactionType === TransactionTypeEnum.DR ? (
          <span>Rs. {commaSeparator(record?.amount)}</span>
        ) : (
          "-"
        ),
    },
    {
      title: "CR.",
      hidden: isSmScreen,
      render: (value, record) =>
        record?.transactionType === TransactionTypeEnum.CR ? (
          <span>Rs. {commaSeparator(record?.amount)}</span>
        ) : (
          "-"
        ),
    },
    {
      title: "Balance",
      hidden: isSmScreen,
      render: (value, record) =>
        `Rs.${commaSeparator(record?.atm?.mainBalance)}`,
    },
  ];
  return TableColumns;
}

export default TransactionTableColumn;

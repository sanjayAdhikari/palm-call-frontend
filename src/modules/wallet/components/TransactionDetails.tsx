import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { ITransaction, TransactionTypeEnum, GeneralStatusEnum, TransactionCategoryEnum } from "interfaces";
import { commaSeparator } from "utils";
import moment from "moment";
import { BsDownload as  DownloadIcon} from "react-icons/bs";

const readableLabels = {
  [GeneralStatusEnum.DONE]: "Completed",
  [GeneralStatusEnum.PENDING]: "Pending",
  [GeneralStatusEnum.CANCELLED]: "Cancelled",
  [GeneralStatusEnum.AMBIGUOUS]: "Ambiguous",
  [TransactionTypeEnum.DR]: "Debit",
  [TransactionTypeEnum.CR]: "Credit",
  [TransactionCategoryEnum.SETTLEMENT]: "Settlement",
  [TransactionCategoryEnum.WALLET_LOAD_ESEWA]: "Wallet Load (eSewa)",
  [TransactionCategoryEnum.WALLET_LOAD_KHALTI]: "Wallet Load (Khalti)",
  [TransactionCategoryEnum.REFER_EARN]: "Referral Earning",
  [TransactionCategoryEnum.REFUND]: "Refund",
  [TransactionCategoryEnum.CARGO_FREIGHT_CHARGE]: "Freight Charge",
  [TransactionCategoryEnum.CARGO_FINE]: "Cargo Fine",
};

function TransactionDetails({ details }: { details: ITransaction }) {
  const isIncome = details?.transactionType === TransactionTypeEnum.CR;
  const ref = useRef(null);

  const downloadScreenshot = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = `Transaction-${details.transactionID}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.click();
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <button
          onClick={downloadScreenshot}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm"
        >
          <DownloadIcon size={18} /> Download
        </button>
      </div>

      <div ref={ref} className="flex flex-col gap-5 border p-5 rounded-md bg-white">
        <div className="border-b border-gray-100 pb-2 mb-2 flex items-center justify-between">
          <div className={"flex flex-col gap-1"}>
            <div className="text-gray-500 text-sm">Transaction ID:</div>
            <div className="font-semibold text-lg">{details?.transactionID || "N/A"}</div>
            <div className="text-gray-500 text-xs">UUID: {details?.uuid || "N/A"}</div>
          </div>
          <div className={"flex flex-col gap-2 text-right"}>
            <div className={`text-gray-500 text-sm`}>Amount:</div>
            <div className={`font-bold ${isIncome ? "text-green-500" : "text-red-500"}`}>
              Rs. {commaSeparator(details?.amount)}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 pb-2 mb-2">
          <div className="flex justify-between items-center">
            <div className={"flex flex-col gap-2"}>
              <div className="text-gray-500 text-sm">Main Balance:</div>
              <div className="font-medium">Rs. {commaSeparator(details?.atm?.mainBalance)}</div>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className="text-gray-500 text-sm">Status:</div>
              <div className="font-medium text-green-600">
                {readableLabels[details?.transactionStatus] || details?.transactionStatus || "N/A"}
              </div>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className="text-gray-500 text-sm">Settlement:</div>
              <div className="font-medium">{details?.settlementStatus || "N/A"}</div>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col gap-5 sm:justify-between sm:items-center mb-2">
          <div className={"flex flex-col gap-2"}>
            <div className="text-gray-500 text-sm">Transaction Type:</div>
            <div className="font-medium">{readableLabels[details?.transactionType] || details?.transactionType || "N/A"}</div>
          </div>
          <div className={"flex flex-col gap-2"}>
            <div className="text-gray-500 text-sm">Category:</div>
            <div className="font-medium">{readableLabels[details?.transactionCategory] || details?.transactionCategory || "N/A"}</div>
          </div>
          <div className={"flex flex-col gap-2"}>
            <div className="text-gray-500 text-sm">Service:</div>
            <div className="font-medium">{details?.service || "N/A"}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-gray-500 text-sm">Transaction At:</div>
          <div className="font-medium">{moment(details?.updatedAt).format("YYYY-MM-DD hh:mm A")}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-gray-500 text-sm">Created At:</div>
          <div className="font-medium">{moment(details?.createdAt).format("YYYY-MM-DD hh:mm A")}</div>
        </div>

        <div className="border-t border-gray-100 pt-2 flex flex-col gap-5">
          <div className="flex flex-col gap-2 w-full">
            <div className="text-gray-500 text-sm">Description:</div>
            <div className="font-medium w-full break-words">
              {details?.description || "N/A"}
            </div>
          </div>
          <div className={"flex flex-col gap-2"}>
            <div className="text-gray-500 text-sm">Remarks:</div>
            <div className="font-medium">{details?.remarks || "N/A"}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionDetails;
import React, { useEffect, useRef, useState } from "react";
import { AppIconType, IOrder, IPackageInvoiceItem } from "interfaces";
import { MyButton, MyModal } from "components";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { toWords } from "number-to-words";
import { getAddressHandler } from "utils";

function InvoiceReport({ order, onClose }: { order: IOrder; onClose: any }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  const invoiceDetails = order?.invoice;

  const packageInfo = (() => {
    let totalWeight = 0;
    let totalPrice = 0;
    let totalQty = 0;
    let items: Record<number, IPackageInvoiceItem[]> = {};
    invoiceDetails?.items?.forEach((e) => {
      totalPrice += e?.unitRate * e?.quantity || 0;
      totalWeight += e?.unitWeight * e?.quantity || 0;
      totalQty += e?.quantity;
      if (items[e?.packageNumber]) {
        items[e?.packageNumber].push(e);
      } else {
        items[e?.packageNumber] = [e];
      }
    });
    return {
      items,
      totalWeight,
      totalQty,
      totalPrice,
    };
  })();

  return (
    <MyModal title={""} width={"700px"} onCancel={() => onClose()}>
      <div>
        <div className={"flex justify-end mt-5"}>
          <MyButton
            size={"small"}
            variant={"outlined"}
            name={"Print"}
            iconType={AppIconType.PRINT}
            onClick={() => reactToPrintFn()}
          />
        </div>
        <div
          ref={contentRef}
          className="mt-5 uppercase flex flex-col gap-2 p-5"
        >
          {/* Header Section */}
          <div className="flex justify-between">
            <div>
              {/* sender Section */}
              <div className="mt-4 flex flex-col gap-2">
                <span className="font-bold">FROM</span>
                <span className="text-sm font-semibold">
                  {order?.vendor?.name}
                </span>
                <span className="text-sm">
                  {order?.vendor?.address?.street}
                  {order?.vendor?.address?.county && ", "}
                  {order?.vendor?.address?.county}
                </span>
                <span className="text-sm">
                  TEL: {order?.vendor?.phone || "N/A"}
                </span>
                <span className="text-sm">
                  Email: {order?.vendor?.primaryEmail || "N/A"}
                </span>
              </div>
              {/* Receiver Section */}
              <div className="mt-4 flex flex-col gap-2">
                <span className="font-bold">TO</span>
                <span className="text-sm font-semibold">
                  {order?.consignee?.name}
                </span>
                <span className="text-sm">
                  {getAddressHandler(order?.consignee?.address)}
                </span>
                <span className="text-sm">TEL: {order?.consignee?.phone}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2  text-sm text-right">
              <span className=" font-bold bg-black text-white px-4 py-1">
                INVOICE AND PACKING LIST
              </span>
              <span className="text-sm font-semibold uppercase">
                Shipper Invoice No: {order?.wayBillNumber}
              </span>
              <span className="text-sm font-semibold uppercase">
                Shipper Invoice Date:{" "}
                <span className="font-bold">
                  {moment(invoiceDetails?.invoiceDate)?.format("DD/MM/YYYY")}
                </span>
              </span>
              <span className="text-sm font-semibold uppercase">
                Total Box:{" "}
                <span className="font-bold">
                  {order?.itemsVendor?.length} BOX
                </span>
              </span>
              <span className="text-sm font-semibold uppercase">
                Weight:{" "}
                <span className="font-bold">
                  {order?.totalChargeableWeight || 0} KGS
                </span>
              </span>
              <span className="text-sm font-semibold uppercase">
                Carrier: <span className="font-bold">COURIER</span>
              </span>
            </div>
          </div>
          {/* Table Section */}
          <div className="mt-2">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-200 border border-gray-400">
                  <th className="border p-2">S.NO</th>
                  <th className="border p-2">DESCRIPTION OF GOODS</th>
                  <th className="border p-2">CUSTOM COMMODITY CODE</th>
                  <th className="border p-2">UNIT TYPE</th>
                  <th className="border p-2">QTY</th>
                  <th className="border p-2">
                    UNIT VALUE ({invoiceDetails?.currency})
                  </th>
                  <th className="border p-2">
                    SUB TOTAL ({invoiceDetails?.currency})
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(packageInfo?.items)?.map((value, index) => {
                  const details: IPackageInvoiceItem[] =
                    packageInfo?.items?.[value];
                  return (
                    <>
                      <tr key={index + "box"} className="">
                        <td
                          colSpan={7}
                          className="border text-center p-2 font-bold"
                        >
                          BOX NO {value}
                        </td>
                      </tr>
                      {details?.map((invoiceItem, iKey) => {
                        return (
                          <tr key={iKey}>
                            <td className="border p-2">
                              {invoiceItem?.serialNumber}.
                            </td>{" "}
                            <td className="border p-2 uppercase">
                              {invoiceItem?.particular}
                            </td>{" "}
                            <td className="border p-2"></td>
                            <td className="border p-2">
                              {invoiceItem?.unitType}
                            </td>{" "}
                            <td className="border p-2 text-center">
                              {invoiceItem?.quantity}
                            </td>{" "}
                            <td className="border p-2  text-right">
                              {invoiceItem?.unitRate}
                            </td>{" "}
                            <td className="border p-2  text-right">
                              {invoiceItem?.unitRate * invoiceItem?.quantity}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
                <tr className={"font-bold"}>
                  <td className="border p-2" colSpan={4}>
                    Total
                  </td>
                  <td className="border p-2  text-center">
                    {packageInfo?.totalQty}
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2  text-right">
                    {invoiceDetails?.currency} {packageInfo?.totalPrice}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words */}
          <p className="mt-2 text-sm font-semibold uppercase">
            IN WORDS: {invoiceDetails?.currency}{" "}
            {toWords(packageInfo?.totalPrice)} only
          </p>

          {/* Notes Section */}
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <span className="font-bold">NOTES</span>
            <span>Country of Origin: {order?.sourceCountry}</span>
            <span>{invoiceDetails?.note}</span>
            <span className="font-bold">
              Terms of Delivery: <span className="italic">Prepaid</span>
            </span>
          </div>

          <div className={"flex items-start justify-between mt-10"}>
            <div className={"border-t w-[200px]"}></div>
            {/* Company Stamp */}
            <div className=" text-center text-gray-600 text-sm font-semibold border-t pt-4">
              COMPANY STAMP
            </div>
          </div>
        </div>
      </div>
    </MyModal>
  );
}

export default InvoiceReport;

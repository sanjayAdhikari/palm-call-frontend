import React, { useRef } from "react";
import { AppIconType, IOrder } from "interfaces";
import { MyButton, MyModal, ViewFile } from "components";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { calcVolumetricWeight, getAddressHandler } from "utils";

function WayBillReport({ order, onClose }: { order: IOrder; onClose: any }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  const packageInfo = (() => {
    let totalWeight = 0;
    let totalVolumetricWeight = 0;
    order?.itemsVendor?.forEach((e) => {
      totalWeight += e?.weight;
      totalVolumetricWeight += calcVolumetricWeight(
        e?.length,
        e?.breadth,
        e?.height,
      );
    });
    return {
      totalWeight,
      totalVolumetricWeight,
    };
  })();

  return (
    <MyModal title={"Waybill"} width={"800px"} onCancel={() => onClose()}>
      <div>
        <div className={"flex justify-end mb-2"}>
          <MyButton
            size={"small"}
            variant={"outlined"}
            name={"Print"}
            iconType={AppIconType.PRINT}
            onClick={() => reactToPrintFn()}
          />
        </div>
        <div ref={contentRef} className={"p-5"}>
          <table
            className={"border border-collapse w-full report_table uppercase"}
          >
            <tbody>
              <tr>
                <td>
                  <div className={"flex items-center justify-center"}>
                    <ViewFile
                      className={" max-h-[70px]"}
                      name={[order?.vendor?.logo]}
                    />
                  </div>
                </td>
                <td className={"w-1/2"}>
                  <div className={"flex flex-col"}>
                    <span className={"font-bold text-xl"}>
                      {order?.vendor?.legalName}
                    </span>
                    <span>Website: {order?.vendor?.website || "N/A"}</span>
                  </div>
                </td>
                <td colSpan={2}>
                  <div className={"flex flex-col items-center"}>
                    <span className={"uppercase text-xs"}>AWB Number</span>
                    <span className={"font-bold text-sm"}>
                      {order?.wayBillNumber}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className={"text-xs"}>
                <td
                  className={"text-xs font-medium uppercase whitespace-nowrap"}
                >
                  Account Number
                </td>
                <td className={"font-bold text-sm text-center"}>Destination</td>
                <td className={"font-medium text-xs whitespace-nowrap"}>
                  Forwarding No.
                </td>
                <td rowSpan={2} className={"text-xs font-bold"}>
                  <div
                    className={"flex flex-col gap-2 items-center text-center"}
                  >
                    <span className={"whitespace-nowrap"}>No. of pcs</span>
                    <span>{order?.itemsVendor?.length}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={"text-center"}>
                  {order?.vendor?.vendorID || "N/A"}
                </td>
                <td className={"text-center font-bold text-lg"}>
                  {order?.destinationCountry || "N/A"}
                </td>
                <td className={"text-xs text-center"}>
                  {order?.forwardingNumber || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
          <table className={"border border-collapse w-full report_table"}>
            <tbody>
              <tr className={"border-t-0 uppercase text-center font-bold"}>
                <td className={"w-1/2 "}>SHIPPER</td>
                <td colSpan={3}>CONSIGNEE</td>
                <td>
                  <div className={"flex flex-col text-[10px] font-bold"}>
                    <span className={""}>ACTUAL WEIGHT</span>
                    <span>{packageInfo?.totalWeight || "N/A"} K.G.</span>
                  </div>
                </td>
              </tr>{" "}
              <tr className={"border-t-0"}>
                <td className={"w-1/2 "} rowSpan={4}>
                  {/*  Shipper details*/}
                  <div className={"flex flex-col font-bold text-xs"}>
                    <span>{order?.shipper?.name || "N/A"}</span>
                    <span>{order?.shipper?.address}</span>
                    <span>Phone No. : {order?.shipper?.phone || "N/A"}</span>
                    <span>
                      Email:{" "}
                      {order?.shipper?.email || order?.customer?.email || "N/A"}
                    </span>
                  </div>
                </td>
                <td className={"w-1/2"} colSpan={3} rowSpan={4}>
                  {/*consignee details*/}
                  <div className={"flex flex-col font-bold text-xs"}>
                    <span>{order?.consignee?.name || "N/A"}</span>
                    <span>{getAddressHandler(order?.consignee?.address)}</span>
                    <span>Phone No. : {order?.consignee?.phone || "N/A"}</span>
                    <span>Email: {order?.consignee?.email || "N/A"}</span>
                  </div>
                </td>
                <td>
                  <div
                    className={
                      "flex flex-col text-[10px] font-bold items-center"
                    }
                  >
                    <span className={" uppercase whitespace-nowrap"}>
                      Chargeable WT.
                    </span>
                    <span>{order?.totalChargeableWeight} K.G.</span>
                  </div>
                </td>
              </tr>{" "}
              <tr className={"border-t-0"}>
                <td className={"w-1/2"}>
                  <div
                    className={
                      "flex flex-col text-[10px] font-bold items-center"
                    }
                  >
                    <span className={" uppercase whitespace-nowrap"}>
                      Volumetric WT.
                    </span>
                    <span>{packageInfo?.totalVolumetricWeight} K.G.</span>
                  </div>
                </td>
              </tr>
              <tr className={"border-t-0"}>
                <td className={"w-1/2"}>
                  <div
                    className={
                      "flex flex-col text-[10px] font-bold items-center"
                    }
                  >
                    <span className={" uppercase whitespace-nowrap"}>
                      Shipment value
                    </span>
                    <span>
                      {order?.invoice?.shipmentValue || "N/A"}{" "}
                      {order?.invoice?.currency}
                    </span>
                  </div>
                </td>
              </tr>{" "}
              <tr className={"border-t-0"}>
                <td className={"w-1/2"}>
                  <div
                    className={
                      "flex flex-col text-[10px] font-bold items-center"
                    }
                  >
                    <span className={" uppercase whitespace-nowrap"}>
                      Payment method
                    </span>
                    <span className={"uppercase"}>Prepaid</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td rowSpan={2}>
                  <div className={"flex flex-col text-xs"}>
                    <span className={" uppercase whitespace-nowrap font-bold"}>
                      Description of goods
                    </span>
                    <span>
                      {order?.itemsVendor
                        ?.map((e) => e?.description)
                        ?.join(", ") || "N/A"}
                    </span>
                  </div>
                </td>
                <td className={"font-bold uppercase text-center text-xs"}>
                  {order?.isDox ? "DOX" : "NON-DOX"}
                </td>
                <td rowSpan={2}>
                  <div className={"flex flex-col text-xs"}>
                    <span className={"font-bold"}>Booking date</span>
                    <span>
                      {moment(order?.bookedDate).format("YYYY/MM/DD")}
                    </span>
                  </div>
                </td>
                <td rowSpan={2}>
                  <div className={"flex flex-col text-xs gap-2"}>
                    <span className={"font-bold"}>Insurance</span>
                    <div className={"flex items-center gap-2"}>
                      <span>▫️YES</span>
                      <span>▫️NO</span>
                    </div>
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td className={"font-bold text-center"}>
                  {order?.serviceProvider || "N/A"}
                </td>
                <td></td>
              </tr>
              <tr>
                <td rowSpan={4} className={"w-1/2"} colSpan={2}>
                  <div className={"flex flex-col text-xs"}>
                    <span className={"font-bold uppercase"}>
                      SHIPPER Agreement
                    </span>
                    <span>
                      SHIPPER AGREES TO {order?.vendor?.name} standard terms and
                      conditions of carriage.
                    </span>
                    <span className={"font-bold uppercase"}>
                      Shipper's signature
                    </span>
                    <span className={"font-bold uppercase"}>Date</span>
                    <span className={"font-bold uppercase"}>Booking Date</span>
                    <span>
                      {moment(order?.bookedDate)?.format("YYYY/MM/DD")}
                    </span>
                  </div>
                </td>
                <td rowSpan={4} colSpan={2}>
                  <div
                    className={
                      "flex flex-col text-[10px] uppercase font-bold gap-2"
                    }
                  >
                    <span>Received in good conditions</span>
                    <span>Name</span>
                    <span>SIGN</span>
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td colSpan={5} className={"text-right font-bold text-xs"}>
                  Shipper's copy
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </MyModal>
  );
}

export default WayBillReport;

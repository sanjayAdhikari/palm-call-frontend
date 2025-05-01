import React, { useRef } from "react";
import { AppIconType, IOrder } from "interfaces";
import { MyButton, MyModal, ViewFile } from "components";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { getAddressHandler } from "utils";
import Logo from "assets/logo.jpg";

function BoxLabelReport({ order, onClose }: { order: IOrder; onClose: any }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  return (
    <MyModal
      title={"Box Label"}
      width={"700px"}
      onCancel={() => onClose(false)}
    >
      <div className={"flex flex-col gap-4"}>
        <div className={"flex justify-end"}>
          <MyButton
            size={"small"}
            variant={"outlined"}
            name={"Print"}
            iconType={AppIconType.PRINT}
            onClick={() => reactToPrintFn()}
          />
        </div>

        <div className={"bg-white"} ref={contentRef}>
          {order?.itemsVendor?.map((item, key) => (
            <div className={" h-[550px]"}>
              <table className="report_table w-full text-xs uppercase scale-[0.8] ">
                <tbody>
                  {/* Main Info Table */}
                  <tr>
                    <td>
                      <div className={"flex items-center justify-center"}>
                        {order?.isFIT ? (
                          <ViewFile
                            className={" max-h-[50px]"}
                            name={[order?.vendor?.logo]}
                          />
                        ) : (
                          <img
                            alt={"logo"}
                            src={Logo}
                            className={"max-h-[50px]"}
                          />
                        )}
                      </div>
                    </td>
                    <td colSpan={3} className={"w-1/2"}>
                      <div className={"flex flex-col"}>
                        <span className={"font-bold text-xl"}>
                          {order?.vendor?.legalName}
                        </span>
                        <span>Website: {order?.vendor?.website || "N/A"}</span>
                      </div>
                    </td>
                    <td>
                      <div className={"flex flex-col items-center"}>
                        <span className={"uppercase text-xs"}>AWB Number</span>
                        <span className={"font-bold text-sm"}>
                          {order?.wayBillNumber}
                        </span>
                      </div>
                    </td>
                    <td className={"text-center"}>
                      <span className={"text-xl font-bold"}>
                        {item?.serialNumber}/{order?.itemsVendor?.length}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className={"font-bold"}>Account Number</td>
                    <td className={"font-bold"}>Service</td>
                    <td className={"font-bold"}>Origin</td>
                    <td className={"font-bold"}>Destination</td>
                    <td className={"font-bold"}>Forwarding No.</td>
                    <td className={"font-bold"}>Box Weight</td>
                  </tr>{" "}
                  <tr className="border-b">
                    <td>{order?.vendor?.vendorID || "N/A"}</td>
                    <td>{order?.serviceProvider || "N/A"}</td>
                    <td>{order?.sourceCountry || "N/A"}</td>
                    <td>{order?.destinationCountry || "N/A"}</td>
                    <td>{order?.forwardingNumber || "N/A"}</td>
                    <td>{item?.weight} kg.</td>
                  </tr>
                  <tr className="border-b">
                    <td className={"font-bold"} colSpan={3}>
                      Sender's company
                    </td>
                    <td className={"font-bold"} colSpan={2}>
                      Recipient's company
                    </td>
                    <td className={"font-bold"}>DIMS In Cm</td>
                  </tr>
                  <tr className="border-b">
                    <td colSpan={3}>{order?.vendor?.legalName}</td>
                    <td colSpan={2}>{order?.consignee?.name}</td>
                    <td>
                      {[item?.length, item?.breadth, item?.height]?.join("X")}{" "}
                      cm
                      <sup>3</sup>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className={"font-bold"} colSpan={3}>
                      Sender's name
                    </td>
                    <td className={"font-bold"} colSpan={2}>
                      Recipient's name
                    </td>
                    <td className={"font-bold"}>Box vol wt</td>
                  </tr>
                  <tr className="border-b">
                    <td colSpan={3}>{order?.vendor?.legalName}</td>
                    <td colSpan={2}>{order?.consignee?.name}</td>
                    <td>{item?.volumetricWeight} kg.</td>
                  </tr>
                  <tr className="border-b">
                    <td className={"font-bold"} colSpan={3}>
                      Address
                    </td>
                    <td className={"font-bold"} colSpan={2}>
                      Address
                    </td>
                    <td>
                      <div className={"flex flex-col"}>
                        <span className={"font-bold whitespace-nowrap"}>
                          Actual WT.
                        </span>
                        <span>{item?.weight} kg.</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td rowSpan={3} colSpan={3}>
                      {/*TODO: add phone number, pin code*/}
                      {getAddressHandler(order?.vendor?.address)}
                    </td>
                    <td rowSpan={3} colSpan={2}>
                      {getAddressHandler(order?.consignee?.address)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <div className={"flex flex-col"}>
                        <span className={"font-bold whitespace-nowrap"}>
                          Chargeable WT.
                        </span>
                        <span>{item?.chargeableWeight} kg.</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <div className={"flex flex-col"}>
                        <span className={"font-bold whitespace-nowrap"}>
                          Payment Method
                        </span>
                        <span>Prepaid</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={2} colSpan={3}>
                      <div className={"flex flex-col text-xs"}>
                        <span
                          className={" uppercase whitespace-nowrap font-bold"}
                        >
                          Description of goods
                        </span>
                        <span>{item?.description || "N/A"}</span>
                      </div>
                    </td>{" "}
                    <td>
                      <div className={"flex gap-2 text-xs"}>
                        <span className={"  whitespace-nowrap font-bold"}>
                          PCS
                        </span>
                        <span>{order?.itemsVendor?.length}</span>
                      </div>
                    </td>
                    <td>
                      <div className={"flex flex-col text-xs"}>
                        <span className={"font-bold"}>Booking date</span>
                        <span>
                          {moment(order?.bookedDate).format("YYYY/MM/DD")}
                        </span>
                      </div>
                    </td>
                    <td>FREIGHT: 0.00</td>
                  </tr>
                  <tr>
                    <td className={"font-bold"}>
                      {order?.isDox ? "DOX" : "DOX"}
                    </td>
                    <td className={"font-bold"}>
                      <div
                        className={"flex flex-col text-xs text-center gap-2"}
                      >
                        <span className={"font-bold"}>Insurance</span>
                        <div className={"flex items-center gap-2"}>
                          <span>▫️YES</span>
                          <span>▫️NO</span>
                        </div>
                      </div>
                    </td>
                    <td>OTHER: 0.00</td>
                  </tr>
                  <tr>
                    <td className={"w-1/2"} rowSpan={4} colSpan={4}>
                      <div className={"flex flex-col text-xs"}>
                        <span className={"font-bold uppercase"}>
                          SHIPPER Agreement
                        </span>
                        <span>
                          SHIPPER AGREES TO {order?.vendor?.name} standard terms
                          and conditions of carriage.
                        </span>
                        <span className={"font-bold uppercase"}>
                          Shipper's signature
                        </span>
                        <span className={"font-bold uppercase"}>Date</span>
                        <span className={"font-bold uppercase"}>
                          Booking Date
                        </span>
                        <span>
                          {moment(order?.createdAt)?.format("YYYY/MM/DD")}
                        </span>
                      </div>
                    </td>
                    <td rowSpan={4}>
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
                    <td>Total: 0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </MyModal>
  );
}

export default BoxLabelReport;

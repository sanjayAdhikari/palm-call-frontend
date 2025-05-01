import React, { useRef } from "react";
import { AppIconType, IOrder } from "interfaces";
import { MyButton, MyModal } from "components";
import { useReactToPrint } from "react-to-print";
import { getAddressHandler } from "utils";
import Barcode from "react-barcode";

function AddressLabelReport({
  order,
  onClose,
}: {
  order: IOrder;
  onClose: any;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  const ShipperDetails = {
    Name: (
      <span className={"font-bold text-xl underline uppercase"}>
        {order?.vendor?.legalName || order?.vendor?.name || "N/A"}
      </span>
    ),
    Address: <span>{getAddressHandler(order?.vendor?.address) || "N/A"}</span>,
    Country: <span>{order?.sourceCountry || "N/A"}</span>,
    Phone: <span>{order?.vendor?.phone || "N/A"}</span>,
  };
  const ReceiverDetails = {
    Name: <span>{order?.consignee?.name || "N/A"}</span>,
    Address: <span>{order?.consignee?.address?.street || "N/A"}</span>,
    "Postal code": (
      <span>{order?.consignee?.address?.postalCode || "N/A"}</span>
    ),
    City: <span>{order?.consignee?.address?.city || "N/A"}</span>,
    State: <span>{order?.consignee?.address?.county || "N/A"}</span>,
    Country: <span>{order?.destinationCountry || "N/A"}</span>,
    Phone: <span>{order?.consignee?.phone || "N/A"}</span>,
    "Secondary Phone": <span>{order?.consignee?.secondaryPhone || "N/A"}</span>,
  };
  return (
    <MyModal
      title={"Address Label"}
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

        <div
          className={"bg-white flex flex-col gap-4 p-5 uppercase"}
          ref={contentRef}
        >
          {[...order?.itemsVendor]?.map((item, key) => {
            const isLastItem = [...order?.itemsVendor]?.length === key + 1;
            const breakPage = (key + 1) % 2 == 0 && !isLastItem;
            return (
              <>
                {/*Shipper Details*/}
                <div
                  className={"border p-2 border-black "}
                  key={key + "shipper"}
                >
                  <div className={"flex items-center justify-between"}>
                    <span className={"font-semibold text-xl"}>Shipper</span>
                    <span className={"text-xl font-bold"}>
                      {item?.serialNumber}/{order?.itemsVendor?.length}
                    </span>
                  </div>
                  <div>
                    {Object.keys(ShipperDetails)?.map((key) => {
                      const details = ShipperDetails?.[key];
                      return (
                        <div
                          className={"grid grid-cols-[150px_auto] gap-5"}
                          key={key}
                        >
                          <span>{key}</span>
                          {details}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={
                      "w-full flex flex-col items-end gap-1 text-center"
                    }
                  >
                    <Barcode
                      fontSize={30}
                      className={"h-[80px]"}
                      value={order?.wayBillNumber}
                    />
                  </div>
                </div>{" "}
                {/*Consignee Details*/}
                <div
                  className={"border p-2 border-black "}
                  key={key + "consignee"}
                >
                  <div className={"flex items-center justify-between"}>
                    <span className={"font-semibold text-xl"}>Consignee</span>
                    <span className={"text-xl font-bold"}>
                      {item?.serialNumber}/{order?.itemsVendor?.length}
                    </span>
                  </div>
                  <div>
                    {Object.keys(ReceiverDetails)?.map((key) => {
                      const details = ReceiverDetails?.[key];
                      return (
                        <div
                          className={"grid grid-cols-[150px_auto] gap-5"}
                          key={key}
                        >
                          <span>{key}</span>
                          {details}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={
                      "w-full flex flex-col items-end gap-1 text-center"
                    }
                  >
                    <Barcode
                      fontSize={30}
                      className={"h-[80px]"}
                      value={order?.wayBillNumber}
                    />
                  </div>
                </div>
                {breakPage && <div className={"page-break"}></div>}
              </>
            );
          })}
        </div>
      </div>
    </MyModal>
  );
}

export default AddressLabelReport;

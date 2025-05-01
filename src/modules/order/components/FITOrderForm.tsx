import React, { useContext } from "react";
import {
  FITReceiptDetails,
  InvoiceForm,
  ManageConsigneeDetails,
  ManageShipperDetails,
  SourceDestinationCountryForm,
  PackageBulkForm,
  ExtraChargesForm,
} from "./Forms";
import { MyButton, MyInput } from "components";
import { useFormikContext } from "formik";
import { IOrder } from "interfaces";
import { getEditableFields } from "../helpers";

function FitOrderForm() {
  const { errors, values } = useFormikContext<IOrder>();
  const isConsigneeValid = !errors?.consignee;
  const isShipperValid = !errors?.shipper;

  let { isConsigneeEditable, isShipperEditable, canEditPackages } =
    getEditableFields(values?.status);
  if (!values?._id) {
    canEditPackages = true;
    isShipperEditable = true;
    isConsigneeEditable = true;
  }

  return (
    <div className={"grid grid-cols-3 gap-5 h-full w-full overflow-scroll "}>
      <div
        className={
          "col-span-2 flex flex-col gap-3 w-full h-full  overflow-scroll"
        }
      >
        {/*  Order details*/}
        <div className={"bg-white p-4 flex flex-col gap-4 rounded-3xl"}>
          <span className={"text-base font-semibold"}>Order Details</span>
          <div className={"grid grid-cols-3 gap-4"}>
            <MyInput
              inputSize={"middle"}
              inputType={"date"}
              label={"Booked Date"}
              name={"bookedDate"}
            />
            <MyInput
              inputSize={"middle"}
              inputType={"text"}
              placeholder={"Enter tracking id"}
              label={"Tracking ID"}
              name={"trackingID"}
            />
            <MyInput
              inputSize={"middle"}
              inputType={"text"}
              label={"Forwarding No."}
              placeholder={"Enter forwarding no."}
              name={"forwardingNumber"}
            />
            <MyInput
              inputSize={"middle"}
              inputType={"text"}
              label={"Service Provider"}
              placeholder={"Enter service provider"}
              name={"serviceProvider"}
            />
            <MyInput
              inputSize={"middle"}
              placeholder={"Enter carrier"}
              label={"Carrier"}
              name={"carrier"}
            />
            <div className={"pt-8"}>
              <MyInput
                inputType={"checkbox"}
                label={"Is DOX?"}
                name={"isDox"}
              />
            </div>
          </div>
        </div>
        {/*  Parcel Details*/}
        {canEditPackages && <PackageBulkForm fieldName={"itemsVendor"} />}
        {/*Invoice*/}
        <InvoiceForm />
      </div>
      <div className={"flex flex-col gap-3 h-full overflow-scroll"}>
        {/*Shipper details*/}
        {(isShipperEditable || isConsigneeEditable) && (
          <div className={"bg-white p-4 flex flex-col gap-4 rounded-3xl"}>
            {isShipperEditable && (
              <>
                <div className={"flex flex-col gap-2"}>
                  <SourceDestinationCountryForm />
                </div>
                <div className={"flex flex-col gap-2"}>
                  <span className={"text-base font-semibold"}>
                    Shipper/Sender
                  </span>
                  <ManageShipperDetails />
                </div>
              </>
            )}
            {isConsigneeEditable && (
              <div className={"flex flex-col gap-2"}>
                <span className={"text-base font-semibold"}>
                  Receiver/Consignee
                </span>
                <ManageConsigneeDetails />
              </div>
            )}
          </div>
        )}
        {/*Extra charge form*/}
        {canEditPackages && <ExtraChargesForm />}
        {/*  receipt details*/}
        <FITReceiptDetails />

        <div className={"flex flex-col"}>
          {[
            !isShipperValid && "Shipper is required",
            !isConsigneeValid && "Receiver is required",
          ]
            ?.filter((e) => e)
            ?.map((e) => <span className={"text-red-500 text-xs"}>* {e}</span>)}
        </div>
        <div>
          <MyButton
            block
            className={"rounded-full"}
            name={"Confirm"}
            htmlType={"submit"}
          />
        </div>
      </div>
    </div>
  );
}

export default FitOrderForm;

import React, { useContext, useState } from "react";
import { IOrder } from "interfaces";
import { MyButton, MyModal } from "components";
import { Form, Formik } from "formik";
import {
  ConsigneeForm,
  PickupAgentForm,
  PickupDetailsForm,
  ShipperForm,
} from "./Forms";
import { getEditableFields } from "../helpers";
import { OrderContext } from "context";
import {
  AssignRiderValidationSchema,
  AssignRiderValues,
  ConsigneeValidationSchema,
  ConsigneeValues,
  PickupDetailsValidationSchema,
  PickupDetailsValues,
  ShipperValidationSchema,
  ShipperValues,
} from "../formikValues";

interface IProps {
  editType:
    | "pickupDetails"
    | "consignee"
    | "shipper"
    | "vendorPackages"
    | "pickupAgent";
  details: IOrder;
}
function PackageEditComponent({ details, editType }: IProps) {
  const [isOpen, setOpen] = useState(false);
  const { editHandler, getDetailsHandler } = useContext(OrderContext);
  const {
    isConsigneeEditable,
    isShipperEditable,
    isAssignedRiderEditable,
    isPickupDetailsEditable,
  } = getEditableFields(details?.status);
  const CurrentFormDetails = () => {
    switch (editType) {
      case "consignee":
        return {
          Element: <ConsigneeForm />,
          title: "Edit Receiver",
          isEditable: isConsigneeEditable,
          initialValue: ConsigneeValues(details?.consignee),
          validationSchema: ConsigneeValidationSchema,
        };
      case "shipper":
        return {
          Element: <ShipperForm />,
          title: "Edit Sender",
          isEditable: isShipperEditable,
          initialValue: ShipperValues(details?.shipper),
          validationSchema: ShipperValidationSchema,
        };
      case "pickupDetails":
        return {
          Element: <PickupDetailsForm />,
          title: "Edit Pickup",
          isEditable: isPickupDetailsEditable,
          initialValue: PickupDetailsValues({
            isSelfDrop: details?.isSelfDrop,
            pickupTimeSlot: details?.pickupTimeSlot,
            specialInstructionByCustomer: details?.specialInstructionByCustomer,
            itemsCustomer: details?.itemsCustomer,
          }),
          validationSchema: PickupDetailsValidationSchema,
        };
      case "pickupAgent":
        return {
          Element: <PickupAgentForm />,
          title: "Edit Pickup Agent",
          isEditable: isAssignedRiderEditable,
          initialValue: AssignRiderValues(details?.pickupAgent),
          validationSchema: AssignRiderValidationSchema,
        };
      default:
        return {
          Element: <></>,
          title: "",
          isEditable: false,
          initialValue: {},
          validationSchema: undefined,
        };
    }
  };

  const onSubmit = async (values: any) => {
    await editHandler(values, {
      onSuccess: async () => {
        await getDetailsHandler(values?._id);
        setOpen(false);
      },
    });
  };

  const { isEditable, initialValue, Element, title, validationSchema } =
    CurrentFormDetails();
  if (!isEditable) return <></>;
  return (
    <div>
      <div
        className={"cursor-pointer text-blue-500 text-sm font-medium"}
        onClick={() => setOpen(true)}
      >
        Edit
      </div>
      {isOpen && (
        <MyModal onCancel={() => setOpen(false)} title={title}>
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              _id: details?._id,
              ...initialValue,
            }}
            onSubmit={onSubmit}
          >
            <Form className={"flex flex-col gap-2"}>
              {Element}
              <MyButton block htmlType={"submit"} name={"Submit"} />
            </Form>
          </Formik>
        </MyModal>
      )}
    </div>
  );
}

export default PackageEditComponent;

import {
  IConsignee,
  IOrderItems,
  IPackageCharge,
  IPackageInvoice,
  IPackageInvoiceItem,
  IPickupAgent,
  IShipper,
  IUserPackageOrderPayload,
} from "interfaces";
import moment from "moment/moment";
import * as yup from "yup";
export const AssignRiderValues = (values?: Partial<IPickupAgent>) => ({
  name: values?.name,
  email: values?.email,
  remarks: values?.remarks,
  phone: values?.phone,
  vendor: values?.vendor?._id,
});
export const PackageItemsValues = (values?: Partial<IOrderItems>) => ({
  commodity: values?.commodity?.map((e) => e?._id) || [],
  description: values?.description,
  serialNumber: values?.serialNumber,
  length: values?.length || 0,
  breadth: values?.breadth || 0,
  height: values?.height || 0,
  weight: values?.weight,
  quantityInBox: values?.quantityInBox,
  isHandleWithCare: values?.isHandleWithCare || false,
});
export const ChargesValues = (values?: Partial<IPackageCharge>) => ({
  title: values?.title,
  description: values?.description,
  amount: values?.amount,
});

export const InvoicePackageValues = (
  values?: Partial<IPackageInvoiceItem>,
) => ({
  packageNumber: values?.packageNumber,
  serialNumber: values?.serialNumber,
  particular: values?.particular,
  HS_CODE: values?.HS_CODE,
  unitType: values?.unitType,
  quantity: values?.quantity,
  unitWeight: values?.unitWeight, // in KG
  totalWeight: values?.totalWeight,
  unitRate: values?.unitRate,
  amount: values?.amount,
});

export const ConsigneeValues = (values?: Partial<IConsignee>) => ({
  consignee: {
    name: values?.name,
    email: values?.email,
    country: values?.country,
    phone: values?.phone,
    secondaryPhone: values?.secondaryPhone,
    address: {
      street: values?.address?.street,
      city: values?.address?.city,
      county: values?.address?.county,
      postalCode: values?.address?.postalCode,
    },
  },
});

export const ShipperValues = (values?: Partial<IShipper>) => ({
  shipper: {
    phone: values?.phone,
    name: values?.name,
    address: values?.address,
    email: values?.email,
    landmark: values?.landmark,
  },
});

export const PickupDetailsValues = (
  values?: Partial<IUserPackageOrderPayload>,
) => ({
  isSelfDrop: values?.isSelfDrop || false,
  pickupTimeSlot: values?.pickupTimeSlot,
  specialInstructionByCustomer: values?.specialInstructionByCustomer,
  itemsCustomer: values?.itemsCustomer || [],
});

export const InvoiceValues = (values?: Partial<IPackageInvoice>) => ({
  invoice: {
    invoiceNumber: values?.invoiceNumber, // same as wayBillNumber
    invoiceDate: values?.invoiceDate || moment().format("YYYY-MM-DD"), // invoice date w.r.t invoice
    referenceNumber: values?.referenceNumber, // invoice number w.r.t invoice
    shipmentValue: values?.shipmentValue,
    invoiceType: values?.invoiceType,
    currency: values?.currency,
    INCOTerms: values?.INCOTerms,
    note: values?.note,
    items: values?.items?.map((e) => InvoicePackageValues(e)) || [],
    totalWeight: values?.totalWeight,
    invoiceAmount: values?.invoiceAmount,
  },
});

export const ShipperValidationSchema = yup.object().shape({
  shipper: yup.object().shape({
    name: yup?.string().required(" "),
    phone: yup?.string().required(" "),
    address: yup?.string().required(" "),
  }),
});
export const ChargesValidationSchema = yup.object().shape({
  charges: yup.array().of(
    yup.object().shape({
      title: yup?.string().required(" "),
      description: yup?.string(),
      amount: yup?.number().min(0, " ").required(" "),
    }),
  ),
});

export const ConsigneeValidationSchema = yup.object().shape({
  consignee: yup.object().shape({
    name: yup?.string().required(" "),
    phone: yup?.string().required(" "),
    email: yup?.string().email(" "),
    address: yup.object().shape({
      street: yup.string().required(" "),
      city: yup.string().required(" "),
      postalCode: yup.string(),
    }),
  }),
});

export const AssignRiderValidationSchema = yup.object().shape({
  name: yup?.string().required(" "),
  email: yup?.string(),
  phone: yup?.string().required(" "),
});

export const ItemValidationSchema = yup.object().shape({
  commodity: yup?.array().of(yup.string()),
  description: yup?.string().required(" "),
  length: yup?.number().min(0, " ").required(" "),
  height: yup?.number().min(0, " ").required(" "),
  breadth: yup?.number().min(0, " ").required(" "),
  weight: yup?.number().min(0, " ").required(" "),
});

export const PickupDetailsValidationSchema = yup.object().shape({
  isSelfDrop: yup.boolean(),
  pickupTimeSlot: yup
    .string()
    .when("isSelfDrop", ([isSelfDrop], schema, options) => {
      if (isSelfDrop) {
        return schema;
      }
      return schema.required(" ");
    }),
  itemsCustomer: yup.array().of(ItemValidationSchema),
});

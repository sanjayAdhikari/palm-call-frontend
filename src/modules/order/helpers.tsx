import {
  IOrder,
  IOrderItems,
  IUserPackageOrderPayload,
  PackageStatusEnum,
  VALID_STATUS_TRANSITIONS,
} from "interfaces";
import * as yup from "yup";
import { calcVolumetricWeight } from "utils";
import moment from "moment";
import {
  ChargesValues,
  ConsigneeValues,
  InvoiceValues,
  PackageItemsValues,
  ShipperValues,
  ConsigneeValidationSchema,
  ChargesValidationSchema,
  ItemValidationSchema,
  ShipperValidationSchema,
} from "./formikValues";

export const FITFormik = {
  initialValues: (values?: Partial<IOrder>): any => {
    return {
      ...(values?._id ? { _id: values?._id } : {}),
      ...(values?.status ? { status: values?.status } : {}),
      bookedDate: values?.bookedDate || moment().format("YYYY-MM-DD"),
      trackingID: values?.trackingID,
      vendor: values?.vendor?._id,
      forwardingNumber: values?.forwardingNumber,
      serviceProvider: values?.serviceProvider, // like DHL - DHL EXPRESS-EX LHR
      carrier: values?.carrier,
      isDox: values?.isDox || false,

      sourceCountry: values?.sourceCountry,
      destinationCountry: values?.destinationCountry,
      deliveryType: values?.deliveryType?._id,

      itemsVendor: values?.itemsVendor?.map((e) => PackageItemsValues(e)) || [
        PackageItemsValues({ serialNumber: 1 }),
      ],

      charges: values?.charges?.map((e) => ChargesValues(e)) || [],

      ...ConsigneeValues(values?.consignee),
      ...ShipperValues(values?.shipper),
      ...InvoiceValues(values?.invoice),
    };
  },
  validationSchema: yup
    .object()
    .shape({
      sourceCountry: yup.string().required(" "),
      destinationCountry: yup.string().required(" "),
      deliveryType: yup.string().required(" "),
      itemsVendor: yup.array().of(ItemValidationSchema),
    })
    .concat(ShipperValidationSchema)
    .concat(ConsigneeValidationSchema)
    .concat(ChargesValidationSchema),
};

export const OrderFormik = {
  initialValues: (values?: Partial<IUserPackageOrderPayload>) => {
    return {
      vendor: values?.vendor,
      deliveryType: values?.deliveryType,
      sourceCountry: values?.sourceCountry,
      destinationCountry: values?.destinationCountry,
      isSelfDrop: values?.isSelfDrop || false,
      isDox: values?.isDox || false,
      pickupTimeSlot: values?.pickupTimeSlot,
      specialInstructionByCustomer: values?.specialInstructionByCustomer,
      itemsCustomer: values?.itemsCustomer?.map((e) =>
        PackageItemsValues(),
      ) || [
        PackageItemsValues({
          weight: 1,
        }),
      ],
      ...ConsigneeValues(values?.consignee),
      ...ShipperValues(values?.shipper),
    };
  },
  validationSchema: yup
    .object()
    .shape({
      isSelfDrop: yup.boolean(),
      vendor: yup.string().required(" "),
      deliveryType: yup.string().required(" "),
      sourceCountry: yup.string().required(" "),
      destinationCountry: yup.string().required(" "),
      pickupTimeSlot: yup
        .string()
        .when("isSelfDrop", ([isSelfDrop], schema, options) => {
          if (isSelfDrop) {
            return schema;
          }
          return schema.required(" ");
        }),
      itemsCustomer: yup.array().of(
        yup.object().shape({
          description: yup?.string().required(" "),
          weight: yup?.number().min(0, " ").required(" "),
        }),
      ),
    })
    .concat(ConsigneeValidationSchema)
    .concat(ShipperValidationSchema),
};

export const calculatePackageWeight = (orderItems: IOrderItems[]) => {
  let totalWeight = 0,
    totalVolWeight = 0,
    chargeableWeight = 0;

  orderItems?.forEach((e) => {
    totalWeight += e?.weight;
    totalVolWeight += calcVolumetricWeight(e?.length, e?.breadth, e?.height);
    chargeableWeight += Math.max(
      e?.weight,
      calcVolumetricWeight(e?.length, e?.breadth, e?.height),
    );
  });

  return { totalVolWeight, totalWeight, chargeableWeight };
};

export const getEditableFields = (status: PackageStatusEnum) => {
  const statusOrder = VALID_STATUS_TRANSITIONS?.[status]?.order;
  return {
    isPickupDetailsEditable: statusOrder >= 0 && statusOrder <= 9,
    showVerifiedPackage: statusOrder >= 11,
    canEditPackages: statusOrder >= 9 && statusOrder <= 12,
    isConsigneeEditable: statusOrder <= 12 && statusOrder >= 0, // Consignee editable from order 0 to 12
    isShipperEditable: statusOrder <= 9 && statusOrder >= 0, // Shipper and assigned rider editable from order 0 to 9
    isAssignedRiderEditable: statusOrder <= 9,
    canAcceptCashPayment: statusOrder >= 11 && statusOrder <= 14, // Cash payment allowed from order 11 to 14
    showPickupAgentInfo: statusOrder >= 9,
    takeLocationAsInputInTimeline: statusOrder >= 12,
    canEditOrdersByVendor: statusOrder >= 9 && statusOrder <= 18,
  };
};

export const CanPay = (order: IOrder) => {
  const statusOrder = VALID_STATUS_TRANSITIONS?.[order?.status]?.order;
  const isFreightFinal = order?.isFreightFinal;
  const hasPaid = order?.payment.hasPaid;
  return statusOrder >= 11 && statusOrder <= 14 && !hasPaid && isFreightFinal;
};

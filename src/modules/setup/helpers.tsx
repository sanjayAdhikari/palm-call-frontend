import {
  CouponDiscountTypeEnum,
  IBadge,
  ICommodity,
  ICoupon,
  IDeliveryType,
  ServiceEnum,
} from "interfaces";
import * as yup from "yup";

export const DeliveryTypeFormik = {
  initialValue: (values?: Partial<IDeliveryType>) => {
    return {
      ...(values?._id ? { _id: values?._id } : {}),
      name: values?.name || "",
      description: values?.description || "",
      icon: values?.icon || "",
      benefits: values?.benefits || [""],
    };
  },
  validationSchema: yup.object().shape({
    name: yup.string().required(" "),
    description: yup.string().required(" "),
    icon: yup.string(),
    benefits: yup.array().of(yup.string()),
  }),
};
export const CommodityFormik = {
  initialValue: (values?: Partial<ICommodity>) => {
    return {
      ...(values?._id ? { _id: values?._id } : {}),
      name: values?.name,
      description: values?.description,
      tags: values?.tags || [],
      isFragile: values?.isFragile || false,
      parent: values?.parent,
    };
  },
  validationSchema: yup.object().shape({
    name: yup.string().required(" "),
  }),
};
export const BadgeFormik = {
  initialValue: (values?: Partial<IBadge>) => {
    return {
      ...(values?._id ? { _id: values?._id } : {}),
      name: values?.name || "",
      description: values?.description || "",
      icon: values?.icon || "",
      benchmark: values?.benchmark || [""],
    };
  },
  validationSchema: yup.object().shape({
    name: yup.string().required(" "),
    description: yup.string().required(" "),
    icon: yup.string(),
    benchmark: yup.array().of(yup.string()),
  }),
};
export const CouponFormik = {
  initialValue: (values?: Partial<ICoupon>) => {
    return {
      ...(values?._id ? { _id: values?._id } : {}),
      title: values?.title,
      code: values?.code,
      vendor: values?.vendor?.map((each) => each._id) || [],
      forAllVendorUnderService: values?.forAllVendorUnderService || false,
      discountFromVendor: values?.discountFromVendor || false,
      service: values?.service || ServiceEnum.HYRE_CARGO,
      validFrom: values?.validFrom,
      validUntil: values?.validUntil,
      totalQuantity: values?.totalQuantity,
      discount: values?.discount,
      discountType: values?.discountType || CouponDiscountTypeEnum.FLAT,
      perCustomerUsage: values?.perCustomerUsage || 1,
      condition: {
        minimumSpendCondition: values?.condition?.minimumSpendCondition || 0, // only applicable if customer spend minimum X
        onlyOnFirstOrder: values?.condition?.onlyOnFirstOrder || false, // only applicable if the customer applied for the first order
      },
    };
  },
  validationSchema: yup.object().shape({
    title: yup.string().required(" "),
    code: yup.string().required(" "),
    validFrom: yup.string().required(" "),
    validUntil: yup.string().required(" "),
    totalQuantity: yup.number().min(0, " ").required(" "),
    discountType: yup
      .mixed<CouponDiscountTypeEnum>()
      .oneOf([CouponDiscountTypeEnum.FLAT, CouponDiscountTypeEnum.PERCENTAGE])
      .required("Discount type is required"),

    discount: yup
      .number()
      .typeError("Discount must be a number")
      .required("Discount is required")
      .when("discountType", ([discountType], schema) => {
        if (discountType === CouponDiscountTypeEnum.PERCENTAGE) {
          return schema
            .min(1, "Must be at least 1%")
            .max(100, "Cannot exceed 100%");
        }
        return schema.min(1, "Minimum discount is 1");
      }),
    perCustomerUsage: yup.number().min(0, " ").required(" "),
    condition: yup.object({
      minimumSpendCondition: yup
        .number()
        .optional()
        .min(0, " ")
        .typeError("Must be a number"),
    }),
  }),
};

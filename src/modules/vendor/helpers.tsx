import {
  CountryType,
  CourierRateType,
  ICourierRate,
  ICourierRateCharge,
  IVendor,
} from "interfaces";
import * as yup from "yup";
import {
  ICountryShippingRateForm,
  ICourierDeliveryRateForm,
  ICourierRateForm,
} from "./interface";

export const VendorFormik = {
  initialValue: (values?: Partial<IVendor>) => {
    return {
      ...(values?._id ? { _id: values?._id } : {}),
      name: values?.name || "",
      isFeatured: values?.isFeatured || false,
      vendorID: values?.vendorID,
      service: values?.service || "HYRE_CARGO",
      vendorType: values?.vendorType || "vendor:international_cargo",
      profileImage: values?.profileImage,
      legalName: values?.legalName,
      logo: values?.logo,
      website: values?.website,
      primaryEmail: values?.primaryEmail,
      phone: values?.phone,
      secondaryPhone: values?.secondaryPhone,
      badge: values?.badge?._id,
      pan: {
        number: values?.pan?.number,
        image: values?.pan?.image || "",
        isVatRegistered: values?.pan?.isVatRegistered || false,
        remarks: values?.pan?.remarks,
      },
      ocr: {
        number: values?.ocr?.number,
        image: values?.ocr?.image || "",
        remarks: values?.ocr?.remarks,
      },
      ward: {
        number: values?.ward?.number,
        image: values?.ward?.image,
        remarks: values?.ward?.remarks,
      },
      contract: {
        document: values?.contract?.document,
        description: values?.contract?.description,
      },
      address: {
        street: values?.address?.street,
        city: values?.address?.city,
        county: values?.address?.county,
        postalCode: values?.address?.postalCode,
      },
    };
  },
  validationSchema: yup.object().shape({
    name: yup.string().required(" "),
    legalName: yup.string().required(" "),
    vendorType: yup.string().required(" "),
    primaryEmail: yup.string().email().required(" "),
    phone: yup.string().required(""),
  }),
};

export const CourierRateFormik = {
  rateValues: (values?: Partial<ICourierRateCharge>) => ({
    ...(values?._id ? { _id: values?._id } : {}),
    minKG: values?.minKG,
    maxKG: values?.maxKG,
    rateType: values?.rateType || CourierRateType.FLAT,
    charge: values?.charge,
    commission: values?.commission,
  }),
  courierRateValues: (values?: Partial<ICourierDeliveryRateForm>) => ({
    ...(values?._id ? { _id: values?._id } : {}),
    baseCharge: values?.baseCharge,
    baseChargeCommission: values?.baseChargeCommission,
    deliveryType: values?.deliveryType,
    isNew: values?.isNew || false,
    rateSlab:
      values?.rateSlab?.length > 0
        ? values?.rateSlab?.map((e) => CourierRateFormik.rateValues(e))
        : [CourierRateFormik.rateValues()],
  }),
  countryShippingValues: (values?: Partial<ICountryShippingRateForm>) => ({
    destinationCountry: values?.destinationCountry,
    sourceCountry: values?.sourceCountry || CountryType.NEPAL,
    isNew: values?.isNew || false,
    delivery:
      values?.delivery?.length > 0
        ? values?.delivery?.map((e) => CourierRateFormik.courierRateValues(e))
        : [],
  }),
  initialValues: (values?: Partial<ICourierRateForm>) => ({
    vendor: values?.vendor,
    benefits: [],
    country:
      values?.country?.length > 0
        ? values?.country?.map((e) =>
            CourierRateFormik.countryShippingValues(e),
          )
        : [],
  }),
  validationSchema: yup.object().shape({
    vendor: yup.string().required(" "),
    sourceCountry: yup.string().required(" "),
    benefits: yup.array().of(yup.string().optional()),
    destinationCountry: yup.string().required(" "),
    delivery: yup.array().of(yup.object().shape({})),
    baseCharge: yup.number().min(0, " ").required(" "),
    baseChargeCommission: yup.number().min(0, " ").required(" "),
    deliveryType: yup.string().required(" "),
    rateSlab: yup.array().of(
      yup.object().shape({
        minKG: yup.number().min(0, " ").required(" "),
        maxKG: yup.number().min(0, " ").required(" "),
        charge: yup.number().min(0, " ").required(" "),
        commission: yup.number().min(0, " ").required(" "),
        rateType: yup.string().required(" "),
      }),
    ),
  }),
};

export const mapCourierRatesToPayload = (
  courierRates: ICourierRate[],
): ICountryShippingRateForm[] => {
  let shippingRateMap: Record<string, ICountryShippingRateForm> = {};

  courierRates?.forEach((rate) => {
    const destination = rate?.destinationCountry;

    if (shippingRateMap[destination]) {
      // If destination country already exists, append the new delivery option
      shippingRateMap[destination].delivery.push({
        _id: rate?._id,
        deliveryType: rate?.deliveryType,
        baseCharge: rate?.baseCharge,
        rateSlab: rate?.rateSlab,
        benefits: rate?.benefits,
        baseChargeCommission: rate?.baseChargeCommission,
      });
    } else {
      // If destination country does not exist, create a new entry
      shippingRateMap[destination] = {
        destinationCountry: rate?.destinationCountry,
        sourceCountry: rate?.sourceCountry,
        delivery: [
          {
            _id: rate?._id,
            deliveryType: rate?.deliveryType,
            baseCharge: rate?.baseCharge,
            baseChargeCommission: rate?.baseChargeCommission,
            rateSlab: rate?.rateSlab,
            benefits: rate?.benefits,
          },
        ],
      };
    }
  });

  // Convert the map object into an array of shipping rates
  return Object.values(shippingRateMap);
};

export const mapPayloadToCourierRates = (
  payload: ICourierRateForm,
): Partial<ICourierRate> => {
  const selectedCountry = payload?.country?.[
    payload?.selectedCountryIndex
  ] as ICountryShippingRateForm;

  const selectedDelivery = selectedCountry?.delivery?.[
    payload?.selectedDeliveryIndex
  ] as ICourierDeliveryRateForm;

  return {
    ...(selectedDelivery?._id ? { _id: selectedDelivery?._id } : {}),
    vendor: payload?.vendor,
    sourceCountry: selectedCountry?.sourceCountry,
    destinationCountry: selectedCountry?.destinationCountry,
    baseChargeCommission: selectedDelivery?.baseChargeCommission,
    baseCharge: selectedDelivery?.baseCharge,
    rateSlab: selectedDelivery?.rateSlab,
    deliveryType: selectedDelivery?.deliveryType,
  };
};

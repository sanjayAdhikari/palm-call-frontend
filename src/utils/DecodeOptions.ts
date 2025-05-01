import {
  CountryType,
  GenderEnum,
  IBadge,
  ICommodity,
  IConsignee,
  ICourierRateCharge,
  IDeliveryType,
  IPaginateData,
  ISelectOption,
  IVendor,
  KycDocumentTypeEnum,
  KycStatusEnum,
} from "interfaces";

export const getVendorOptions = (options: IVendor[]): ISelectOption[] => {
  return options?.map((e) => {
    return {
      label: e?.legalName || e?.name,
      value: e?._id,
    };
  });
};
export const getBadgeOptions = (options: IBadge[]): ISelectOption[] => {
  return options?.map((e) => {
    return {
      label: e?.name,
      value: e?._id,
    };
  });
};
export const getCurrencyOptions = (): ISelectOption[] => {
  return [
    { label: "United States Dollar", value: "USD" },
    { label: "Euro", value: "EUR" },
    { label: "Japanese Yen", value: "JPY" },
    { label: "British Pound", value: "GBP" },
    { label: "Chinese Yuan", value: "CNY" },
    { label: "Nepalese Rupee", value: "NPR" },
    { label: "Indian Rupee", value: "INR" },
  ];
};
export const getINCOTerms = (): ISelectOption[] => {
  return [
    {
      label: "CFR",
      value: "CFR",
    },
    {
      label: "CIF",
      value: "CIF",
    },
    {
      label: "CIP",
      value: "CIP",
    },
    {
      label: "CPT",
      value: "CPT",
    },
    {
      label: "DAP",
      value: "DAP",
    },
    {
      label: "DAT",
      value: "DAT",
    },
    {
      label: "DDP",
      value: "DDP",
    },
    {
      label: "DPU",
      value: "DPU",
    },
    {
      label: "EXW",
      value: "EXW",
    },
    {
      label: "FAS",
      value: "FAS",
    },
    {
      label: "FCA",
      value: "FCA",
    },
    {
      label: "FOB",
      value: "FOB",
    },
  ];
};
export const getUnitOptions = (): ISelectOption[] => {
  return [
    { label: "Packet", value: "PKT" },
    { label: "Piece", value: "PC" },
    { label: "Pieces", value: "PCS" },
    { label: "Numbers", value: "NOS" },
    { label: "Bottle", value: "BOTTLE" },
    { label: "Pair", value: "PAIR" },
    { label: "Strip", value: "STRIP" },
    { label: "Sets", value: "SETS" },
    { label: "Dozen", value: "DOZEN" },
    { label: "Gross", value: "GROSS" },
    { label: "Box", value: "BOX" },
    { label: "Kilogram", value: "KG" },
    { label: "Gram", value: "GRAM" },
    { label: "Container", value: "CONTAINER" },
    { label: "Carats", value: "CARATS" },
  ];
};
export const getDeliveryTypeOptions = (
  options: IDeliveryType[],
): ISelectOption[] => {
  return options?.map((e) => {
    return {
      label: e?.name,
      value: e?._id,
    };
  });
};

export const getCountryOptions = (): ISelectOption[] => {
  return Object.keys(CountryType).map((key) => ({
    label: key.replace(/_/g, " "), // Convert underscores to spaces for better readability
    value: CountryType[key as keyof typeof CountryType],
  }));
};
export const getCommodityOptions = (
  commodity: ICommodity[],
): ISelectOption[] => {
  // TODO: implement child
  return commodity?.map((e) => {
    return {
      label: e?.name,
      value: e?._id,
    };
  });
};
export const getConsigneeOptions = (
  data: IPaginateData<IConsignee>,
): ISelectOption[] => {
  return data?.docs?.map((e) => {
    return {
      label: e?.name,
      value: e?._id,
    };
  });
};
export const getWeightRangeOptions = (): ISelectOption[] => {
  return [
    { label: "Up to 0.5 kg", value: 0.5 },
    { label: "Up to 1 kg", value: 1 },
    { label: "Up to 2 kg", value: 2 },
    { label: "Up to 3 kg", value: 3 },
    { label: "Up to 5 kg", value: 5 },
    { label: "Up to 10 kg", value: 10 },
    { label: "Up to 15 kg", value: 15 },
    { label: "Up to 20 kg", value: 20 },
    { label: "Up to 25 kg", value: 25 },
    { label: "Up to 30 kg", value: 30 },
    { label: "Up to 40 kg", value: 40 },
    { label: "Up to 50 kg", value: 50 },
    { label: "Up to 60 kg", value: 60 },
    { label: "Up to 70 kg", value: 70 },
    { label: "Up to 100 kg", value: 100 },
  ];
};

export const getGenderOptions = (): {label: string, value: any}[] => {
  return [
    {
      label: "Male",
      value: GenderEnum.MALE,
    },
    {
      label: "Female",
      value: GenderEnum.FEMALE,
    },
    {
      label: "Other",
      value: GenderEnum.OTHER,
    },
  ];
};
export const getKycDocumentTypeOptions = (): ISelectOption[] => {
  return [
    {
      label: "Citizenship",
      value: KycDocumentTypeEnum.CITIZENSHIP,
    },
    {
      label: "PAN",
      value: KycDocumentTypeEnum.PAN,
    },
    {
      label: "License",
      value: KycDocumentTypeEnum.LICENSE,
    },
    {
      label: "National Id",
      value: KycDocumentTypeEnum.NATIONAL_ID,
    },
    {
      label: "Voter Id",
      value: KycDocumentTypeEnum.VOTER_ID,
    },
    {
      label: "Passport",
      value: KycDocumentTypeEnum.PASSPORT,
    },
  ];
};
export const getKycStatusOptions = (): ISelectOption[] => {
  return [
    {
      label: "Verified",
      value: KycStatusEnum.VERIFIED,
    },
    {
      label: "Failed",
      value: KycStatusEnum.FAILED,
    },
    {
      label: "Rejected",
      value: KycStatusEnum.REJECTED,
    },
  ];
};

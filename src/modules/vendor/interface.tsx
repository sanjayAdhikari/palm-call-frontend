import { CountryType, ICourierRateCharge } from "interfaces";

export interface ICourierDeliveryRateForm {
  _id?: string;
  deliveryType: string;
  baseCharge: number;
  baseChargeCommission: number;
  isNew?: boolean;
  benefits: string[],
  rateSlab: ICourierRateCharge[];
}

export interface ICountryShippingRateForm {
  destinationCountry: CountryType;
  sourceCountry: CountryType;
  isNew?: boolean;
  delivery: ICourierDeliveryRateForm[];
}
export interface ICourierRateForm {
  vendor: string;
  selectedCountryIndex: string;
  selectedDeliveryIndex: string;
  country: ICountryShippingRateForm[];
}

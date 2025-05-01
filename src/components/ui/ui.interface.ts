import type { FieldConfig } from "formik";
import React from "react";
import { ISelectOption } from "interfaces";
import { boolean } from "yup";
export type SizeType = "small" | "middle" | "large";
type FormikInputType = React.InputHTMLAttributes<any> & FieldConfig<any>;
export interface IInput extends FormikInputType {
  label?: string;
  isRequired?: boolean;
  inputSize?: SizeType;
  showTime?: boolean;
  otpLength?: number;
  minDate?: string;
  maxDate?: string;
  autoSize?: boolean; // text area input to adjust its height.
  variant?: "borderless" | "outlined" | "filled" | "underlined";
  inputType?:
    | "text"
    | "date"
    | "password"
    | "search"
    | "text-area"
    | "select"
    | "radio"
    | "checkbox-group"
    | "otp"
    | "number"
    | "checkbox";
  options?: ISelectOption[];
  addonAfter?: string;
  disabled?: boolean,
  radioOptions?: { label: string; value: any }[];
}

export interface IFile extends FormikInputType {
  label?: string;
  isRequired?: boolean;
}

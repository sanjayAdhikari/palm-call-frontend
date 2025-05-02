import { Checkbox, DatePicker, Input, InputNumber, Radio, Select } from "antd";
import dayjs from "dayjs";
import { useField } from "formik";
import { useScreenSize } from "hooks";
import moment from "moment";
import React from "react";
import { IInput } from "./ui.interface";

function MyInput({
  isRequired,
  label,
  inputType,
  onChange,
  onKeyDown,
  ...props
}: IInput) {
  const [field, meta, helpers] = useField(props);
  const isError = meta.touched && typeof meta?.error === "string";

  const hasMultipleValues = Array.isArray(field?.value);
  const shouldShowLabel = label && inputType !== "checkbox";
  const inputSize = props.inputSize ? props?.inputSize : "large";
  const variant = props.variant ? props?.variant : "outlined";
  const { isSmScreen } = useScreenSize();
  const handleChange = (value: any) => {
    helpers.setTouched(true);
    helpers.setValue(value);
    typeof onChange == "function" && onChange(value);
  };

  const InputComponent = () => {
    switch (inputType) {
      case "date":
        return (
          <DatePicker
            disabledDate={(current) => {
              let minDate = props?.minDate;
              let maxDate = props?.maxDate;
              if (minDate && current?.toDate() < moment(minDate).toDate()) {
                return true;
              }
              return maxDate && current?.toDate() > moment(maxDate).toDate();
            }}
            status={isError ? "error" : undefined}
            size={inputSize}
            variant={variant}
            className={"bg-transparent"}
            value={field?.value ? dayjs(field.value) : null} // Ensure correct value
            showTime={props?.showTime}
            onChange={(date, dateString) => {
              handleChange(dateString?.toString());
            }}
          />
        );
      case "password":
        return (
          <Input.Password
            {...field}
            {...props}
            status={isError ? "error" : undefined}
            size={inputSize}
            variant={variant}
            className={"bg-transparent"}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
      case "number":
        return (
          <InputNumber
            {...field}
            inputMode={props?.inputMode}
            disabled={props?.disabled}
            variant={variant}
            autoFocus={props?.autoFocus}
            status={isError ? "error" : undefined}
            placeholder={props?.placeholder}
            size={inputSize}
            className={` bg-transparent w-full`}
            onChange={(e) => handleChange(e)}
          />
        );
      case "search":
        return (
          <Input.Search
            {...field}
            {...props}
            className={"bg-transparent"}
            status={isError ? "error" : undefined}
            size={inputSize}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
      case "text-area":
        return (
          <Input.TextArea
            {...field}
            onKeyDown={(value) => {
              typeof onChange == "function" && onChange(value);
            }}
            className={props?.className || "bg-transparent"}
            status={isError ? "error" : undefined}
            size={inputSize}
            autoSize={props?.autoSize}
            variant={variant}
            placeholder={props?.placeholder}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
      case "otp":
        return (
          <Input.OTP
            inputMode="numeric"
            autoFocus={props?.autoFocus}
            length={props?.otpLength}
            status={isError ? "error" : undefined}
            size={inputSize}
            variant="outlined"
            onChange={(val) => handleChange(val)}
            style={{ borderRadius: "12px" }}
            className="flex justify-between gap-2" // wrapper layout
          />
        );
      case "select":
        return (
          <Select
            disabled={props?.disabled}
            showSearch={!isSmScreen}
            autoFocus={props?.autoFocus}
            status={isError ? "error" : undefined}
            value={field?.value}
            variant={variant}
            mode={hasMultipleValues ? "multiple" : undefined}
            options={props?.options}
            className={"bg-transparent"}
            onChange={(e) => {
              handleChange(e);
            }}
            notFoundContent={<span>No options</span>}
            placeholder={props?.placeholder}
            size={inputSize}
          />
        );
      case "radio":
        return (
          <Radio.Group
            value={field?.value}
            onChange={(e) => {
              e?.stopPropagation();
              handleChange(e?.target?.value);
            }}
            className={"bg-transparent"}
            options={props?.radioOptions}
          />
        );
      case "checkbox-group":
        return (
          <Checkbox.Group
            value={field?.value}
            onChange={(e) => {
              handleChange(e);
            }}
            className={"bg-transparent"}
            options={props?.radioOptions}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            disabled={props?.disabled}
            checked={field?.value}
            onChange={() => {
              handleChange(!field?.value);
            }}
          >
            {label}
          </Checkbox>
        );
      default:
        return (
          <Input
            {...field}
            {...props}
            className={`${
              inputSize == "small"
                ? " h-[27px] text-sm"
                : inputSize == "middle"
                  ? "h-[32px]"
                  : ""
            } rounded-md border-[#D8D8D9] bg-transparent hover:border-blue-500`}
            status={isError ? "error" : undefined}
            size={inputSize}
            variant={variant}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {shouldShowLabel && (
        <label className="text-sm">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex flex-col gap-1">
        {InputComponent()}
        {isError && (
          <span className="text-red-500 text-[0.8rem]">{meta.error}</span>
        )}
      </div>
    </div>
  );
}

export default MyInput;

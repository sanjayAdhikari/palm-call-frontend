import React, { useContext } from "react";
import { MyInput } from "components";
import { MyFile } from "components";
import { capitalizeFirstLetter, getBadgeOptions } from "utils";
import { OptionContext } from "context";
import { VendorUserTypeEnum } from "interfaces";

function EditVendorForm() {
  const {
    options: { badges },
  } = useContext(OptionContext);
  return (
    <div className={"flex flex-col gap-10"}>
      <div className={"grid grid-cols-2 gap-5"}>
        <MyInput
          name={"vendorID"}
          label={"Vendor ID"}
          placeholder={"Enter vendor id"}
        />
        <MyInput
          name={"vendorType"}
          label={"Vendor Type"}
          inputType={"select"}
          options={[
            {
              label: capitalizeFirstLetter("INTERNATIONAL CARGO"),
              value: VendorUserTypeEnum.INTERNATIONAL_CARGO_VENDOR,
            },
            {
              label: capitalizeFirstLetter("DOMESTIC_LOGISTIC"),
              value: VendorUserTypeEnum.DOMESTIC_LOGISTIC_VENDOR,
            },
          ]}
          placeholder={"Eg: Hyre cargo pvt. ltd."}
          isRequired
        />
        <MyInput
          name={"name"}
          label={"Name"}
          placeholder={"Eg: Hyre cargo"}
          isRequired
        />
        <MyInput
          name={"legalName"}
          label={"Legal name"}
          placeholder={"Eg: Hyre cargo pvt. ltd."}
          isRequired
        />{" "}
        <MyFile label={"Display Image"} name={"profileImage"} />
        <MyFile label={"Logo"} name={"logo"} />
        <MyInput
          name={"isFeatured"}
          label={"Featured"}
          inputType={"checkbox"}
          isRequired
        />{" "}
        <MyInput
          placeholder={"Select badge"}
          name={"badge"}
          label={"Badge"}
          inputType={"select"}
          options={getBadgeOptions(badges)}
        />
      </div>

      <div className={"flex flex-col gap-5"}>
        <span className={"font-bold text-[1.4rem]"}>Contact Information</span>
        <div className={"grid grid-cols-2 gap-5 items-start"}>
          <MyInput
            name={"primaryEmail"}
            label={"Email"}
            placeholder={"Eg: hyre.cargo@hyre.com.np"}
            isRequired
          />
          <MyInput
            name={"website"}
            label={"Website"}
            placeholder={"Eg: hyre.cargo.com.np"}
          />

          <div className={"col-span-2 grid grid-cols-2 gap-5 items-start"}>
            <MyInput
              name={"phone"}
              label={"Phone"}
              placeholder={"Eg: 9844111111"}
              isRequired
            />{" "}
            <MyInput
              name={"secondaryPhone"}
              label={"Secondary phone"}
              placeholder={"Eg: 9844111111"}
            />
          </div>
        </div>
      </div>
      <div className={"flex flex-col gap-5"}>
        <span className={"font-bold text-[1.4rem]"}>Business Details</span>
        <div className={"col-span-2 grid grid-cols-2 gap-5 items-start"}>
          <MyInput
            name={"pan.number"}
            label={"PAN"}
            placeholder={"Eg: 89782134"}
          />
          <MyInput
            name={"ocr.number"}
            label={"OCR"}
            placeholder={"Eg: 9844111111"}
            isRequired
          />
          <MyInput
            name={"pan.remarks"}
            label={"PAN remarks"}
            placeholder={"Eg: 89782134"}
          />{" "}
          <MyInput
            name={"ocr.remarks"}
            label={"OCR remarks"}
            placeholder={"Eg: 89782134"}
          />{" "}
          <MyFile label={"PAN Image"} name={"pan.image"} />
          <MyFile label={"OCR Image"} name={"ocr.image"} />
          <MyInput
            inputType={"checkbox"}
            name={"pan.isVatRegistered"}
            label={"VAT registered"}
          />
        </div>
      </div>
      <div className={"flex flex-col gap-5"}>
        <span className={"font-bold text-[1.4rem]"}>Ward Information</span>
        <div className={"col-span-2 grid grid-cols-2 gap-5 items-start"}>
          <MyInput
            name={"ward.number"}
            label={"Ward"}
            placeholder={"Eg: Lalitpur 9, Imadol"}
          />
          <MyInput
            name={"ward.remarks"}
            label={"Ward remarks"}
            placeholder={"Eg: 89782134"}
          />
          <MyFile label={"Ward Image"} name={"ward.image"} />
        </div>
      </div>
      <div className={"flex flex-col gap-5"}>
        <span className={"font-bold text-[1.4rem]"}>Address</span>
        <div className={"grid grid-cols-2 gap-4 items-start"}>
          <MyInput
            name={`address.street`}
            placeholder={"Enter street"}
            label={"Street"}
            isRequired
          />{" "}
          <MyInput
            name={`address.city`}
            placeholder={"Enter city"}
            label={"City"}
            isRequired
          />{" "}
          <MyInput
            name={`address.county`}
            placeholder={"Enter county"}
            label={"County"}
          />{" "}
          <MyInput
            name={`address.postalCode`}
            placeholder={"Enter postal code"}
            label={"Postal code"}
            isRequired
          />
        </div>
      </div>
      {/*  TODO: contract*/}
    </div>
  );
}

export default EditVendorForm;

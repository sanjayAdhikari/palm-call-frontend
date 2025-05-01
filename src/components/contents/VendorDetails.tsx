import React from "react";
import { IVendor } from "interfaces";
import { ViewFile } from "components";
import { capitalizeFirstLetter } from "utils";

function VendorDetails({ details }: { details: IVendor }) {
  const NameValue = ({ name, value }) => {
    return (
      <div className={"flex flex-col gap-2"}>
        <span className={"text-sm text-gray-500"}>{name}</span>
        <span>{value}</span>
      </div>
    );
  };
  return (
    <div className={"flex flex-col gap-5"}>
      <div className={"grid grid-cols-2 gap-5 items-start"}>
        <NameValue name={"Vendor ID"} value={details?.vendorID || "N/A"} />
        <NameValue
          name={"Vendor Type"}
          value={capitalizeFirstLetter(details?.vendorType) || "N/A"}
        />{" "}
        <NameValue name={"Name"} value={details?.name || "N/A"} />
        <NameValue name={"Legal Name"} value={details?.legalName || "N/A"} />
        <NameValue
          name={"Display Image"}
          value={
            details?.profileImage ? (
              <ViewFile
                className={"max-w-[120px] max-h-[120px] rounded-lg"}
                name={[details?.profileImage]}
              />
            ) : (
              "N/A"
            )
          }
        />
        <NameValue
          name={"Logo"}
          value={
            details?.logo ? (
              <ViewFile
                className={"max-w-[120px] max-h-[120px] rounded-lg"}
                name={[details?.logo]}
              />
            ) : (
              "N/A"
            )
          }
        />
        <NameValue
          name={"Feature"}
          value={details?.isFeatured ? "Featured" : "Non-featured"}
        />{" "}
        <NameValue name={"Badge"} value={details?.badge?.name || "N/A"} />
      </div>
      <div className={"flex flex-col gap-4"}>
        <span className={"font-bold"}>Contact Information</span>
        <div className={"grid grid-cols-2 gap-4 items-start"}>
          <NameValue name={"Email"} value={details?.primaryEmail || "N/A"} />
          <NameValue name={"Website"} value={details?.website || "N/A"} />
          <NameValue name={"Phone"} value={details?.phone || "N/A"} />
          <NameValue
            name={"Secondary phone"}
            value={details?.secondaryPhone || "N/A"}
          />
        </div>
      </div>
      <div className={"flex flex-col gap-4"}>
        <span className={"font-bold"}>Business Information</span>
        <div className={"grid grid-cols-2 gap-4 items-start"}>
          <NameValue name={"PAN"} value={details?.pan?.number || "N/A"} />
          <NameValue name={"OCR"} value={details?.ocr?.number || "N/A"} />
          <NameValue
            name={"PAN Remarks"}
            value={details?.pan?.remarks || "N/A"}
          />
          <NameValue
            name={"OCR remarks"}
            value={details?.ocr?.remarks || "N/A"}
          />
          <NameValue
            name={"PAN Image"}
            value={
              details?.pan?.image ? (
                <ViewFile
                  className={"max-w-[120px] max-h-[120px] rounded-lg"}
                  name={[details?.pan?.image]}
                />
              ) : (
                "N/A"
              )
            }
          />
          <NameValue
            name={"OCR Image"}
            value={
              details?.pan?.image ? (
                <ViewFile
                  className={"max-w-[120px] max-h-[120px] rounded-lg"}
                  name={[details?.ocr?.image]}
                />
              ) : (
                "N/A"
              )
            }
          />
          <NameValue
            name={"VAT Registered"}
            value={
              details?.pan?.isVatRegistered ? "Registered" : "Not Registered"
            }
          />
        </div>
      </div>
      <div className={"flex flex-col gap-4"}>
        <span className={"font-bold"}>Ward Information</span>
        <div className={"grid grid-cols-2 gap-4 items-start"}>
          <NameValue name={"Ward"} value={details?.ward?.number || "N/A"} />
          <NameValue
            name={"Ward Remarks"}
            value={details?.ward?.remarks || "N/A"}
          />

          <NameValue
            name={"Ward Image"}
            value={
              details?.pan?.image ? (
                <ViewFile
                  className={"max-w-[120px] max-h-[120px] rounded-lg"}
                  name={[details?.ward?.image]}
                />
              ) : (
                "N/A"
              )
            }
          />
        </div>
      </div>
      <div className={"flex flex-col gap-4"}>
        <span className={"font-bold"}>Address Information</span>
        <div className={"grid grid-cols-2 gap-4 items-start"}>
          <NameValue
            name={"Street"}
            value={details?.address?.street || "N/A"}
          />{" "}
          <NameValue name={"City"} value={details?.address?.city || "N/A"} />
          <NameValue
            name={"County"}
            value={details?.address?.county || "N/A"}
          />
          <NameValue
            name={"Postal Code"}
            value={details?.address?.postalCode || "N/A"}
          />
        </div>
      </div>
    </div>
  );
}

export default VendorDetails;

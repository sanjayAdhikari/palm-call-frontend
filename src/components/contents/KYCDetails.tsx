import React from "react";
import { IKyc } from "interfaces";
import { capitalizeFirstLetter } from "utils";
import moment from "moment/moment";
import { ViewFile } from "components";

function KycDetails({ details }: { details: IKyc }) {
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
        <div className={"flex flex-col gap-5"}>
          <NameValue name={"Name"} value={details?.legalName || "N/A"} />
          <NameValue
            name={"Gender"}
            value={capitalizeFirstLetter(details?.gender) || "N/A"}
          />
        </div>
        <NameValue
          name={"Profile Image"}
          value={
            details?.profileImage ? (
              <ViewFile
                name={[details?.profileImage]}
                className={"max-w-[120px] max-h-[120px] rounded-lg"}
              />
            ) : (
              "N/A"
            )
          }
        />
      </div>{" "}
      <div className={"flex flex-col gap-4"}>
        <span className={"font-bold"}>Document Details</span>
        <div className={"grid sm:grid-cols-2 grid-cols-1 gap-5"}>
          <div
            className={"grid sm:grid-cols-2  sm:col-span-2 col-span-1 gap-5"}
          >
            <NameValue
              name={"Document Type"}
              value={capitalizeFirstLetter(details?.documentType || "N/A")}
            />
            <NameValue
              name={"Date of birth"}
              value={
                details?.dateOfBirth
                  ? moment(details?.dateOfBirth).format("YYYY-MM-DD")
                  : "N/A"
              }
            />
          </div>
          <NameValue
            name={"Front"}
            value={
              details?.frontImage ? (
                <ViewFile
                  className={"max-w-[120px] max-h-[120px] rounded-lg"}
                  name={[details?.frontImage]}
                />
              ) : (
                "N/A"
              )
            }
          />
          <NameValue
            name={"Back"}
            value={
              details?.backImage ? (
                <ViewFile name={[details?.backImage]} />
              ) : (
                "N/A"
              )
            }
          />
          <NameValue
            name={"Document number"}
            value={details?.documentNumber || "N/A"}
          />
          <NameValue
            name={"Issued place"}
            value={details?.issuedPlace || "N/A"}
          />
          <NameValue
            name={"Issued date"}
            value={
              details?.issuedDate
                ? moment(details?.issuedDate).format("YYYY-MM-DD")
                : "N/A"
            }
          />
          <NameValue
            name={"Expiry date"}
            value={
              details?.expiryDate
                ? moment(details?.expiryDate).format("YYYY-MM-DD")
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default KycDetails;

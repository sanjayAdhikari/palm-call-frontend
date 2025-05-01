import React from "react";
import { AppIconType, IOrder, KycStatusEnum } from "interfaces";
import {
  capitalizeFirstLetter,
  getAddressHandler,
  getIconsHandler,
  getPackageStatusColor,
} from "utils";
import { useAuthorization } from "hooks";
import { MyButton, UserProfileCard, ViewFile } from "components";
import moment from "moment/moment";
import { Timeline } from "antd";
import { useAppContext } from "context";
import { PackageEditComponent } from "./index";

const VendorAndTripDetails = ({ details }: { details: IOrder }) => {
  const ParcelIcon = getIconsHandler(AppIconType.PARCEL);
  const {
    handler: { setSuccess },
  } = useAppContext();
  const { isUser } = useAuthorization();
  const showUserDetails = !isUser && !details?.isFIT;
  const showParcelInfo = !details?.isFIT;
  const showPickupAgentInfo =
    details?.pickupAgent?.name || details?.pickupAgent?.vendor?.legalName;
  const showOrderDetails = !isUser;
  const showInvoiceDetails = !isUser;
  return (
    <div className="bg-white rounded-3xl  p-4 flex flex-col gap-4 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-gray-400 tracking-wide">
            WAYBILL NUMBER
          </span>
          <MyButton
            onClick={() => {
              navigator.clipboard.writeText(details?.wayBillNumber);
              setSuccess("Copied");
            }}
            color="red"
            name={details?.wayBillNumber}
            size="small"
            variant="dashed"
          />
        </div>
        <div className={"flex flex-col items-end gap-2"}>
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full shadow-sm`}
            style={{
              backgroundColor: getPackageStatusColor(details?.status),
              color: "white",
            }}
          >
            {capitalizeFirstLetter(details?.status)}
          </div>
        </div>
      </div>

      {/* Pickup Info */}
      <div className={"flex flex-col gap-1"}>
        <div className={"flex items-center justify-between"}>
          <span className="text-base font-semibold">Pickup Details</span>
          <PackageEditComponent editType={"pickupDetails"} details={details} />
        </div>
        <div className="grid grid-cols-2 text-sm text-gray-700">
          <div>
            <span className="text-xs text-gray-400">Pickup</span>
            <div>
              {details?.isSelfDrop
                ? "Self Drop"
                : moment(details?.pickupTimeSlot).format("YYYY-MM-DD")}
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Contact</span>
            <div>{details?.shipper?.phone || "N/A"}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Address</span>
            <div>{details?.shipper?.address || "N/A"}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Special Instruction</span>
            <div>{details?.specialInstructionByCustomer || "N/A"}</div>
          </div>
        </div>
        {/* Parcel Info */}
        {showParcelInfo && (
          <div className={"flex items-center gap-2 border p-2 rounded-md mt-2"}>
            <div className={"bg-ash-50 rounded-full p-1 text-red-500"}>
              <ParcelIcon />
            </div>
            <div className={"flex items-center gap-2"}>
              <span>
                {details?.itemsCustomer?.map((e) => e?.description).join(", ")}
              </span>
              <div className="text-xs text-gray-400">
                Approx. weight: {details?.itemsCustomer?.[0]?.weight} K.G.
              </div>
            </div>
          </div>
        )}
      </div>

      {/*User details*/}
      {showUserDetails && (
        <div className={"flex flex-col gap-2"}>
          <span className="text-base font-semibold ">User Details</span>
          <UserProfileCard
            name={details?.customer?.name}
            title={
              details?.customer?.kycStatus == KycStatusEnum.VERIFIED
                ? "KYC verified"
                : "KYC unverified"
            }
          />
        </div>
      )}
      {/* Sender details */}
      <div className={"flex flex-col gap-2"}>
        <div className={"flex items-center justify-between"}>
          <span className="text-base font-semibold">Sender Details</span>
          <PackageEditComponent editType={"shipper"} details={details} />
        </div>
        <UserProfileCard
          name={{
            first: details?.shipper?.name,
          }}
          title={`${details?.shipper?.address}, ${[details?.shipper?.landmark, details?.shipper?.phone, details?.shipper?.email]?.filter((e) => e)?.join(" , ")} `}
        />
      </div>
      {/* Receiver details */}
      <div className={"flex flex-col gap-2"}>
        <div className={"flex items-center justify-between"}>
          <span className="text-base font-semibold">Receiver Details</span>
          <PackageEditComponent editType={"consignee"} details={details} />
        </div>
        <UserProfileCard
          name={{
            first: details?.consignee?.name,
          }}
          title={`${getAddressHandler(details?.consignee?.address)}, ${[details?.consignee?.phone, details?.consignee?.secondaryPhone, details?.consignee?.email]?.filter((e) => e)?.join(" , ")} `}
        />
      </div>
      {/* Pickup agent details */}
      {showPickupAgentInfo && (
        <div className={"flex flex-col gap-1"}>
          <div className={"flex items-center justify-between"}>
            <span className="text-base font-semibold">Pickup Agent</span>
            <PackageEditComponent editType={"pickupAgent"} details={details} />
          </div>
          <UserProfileCard
            name={{
              first:
                details?.pickupAgent?.vendor?.legalName ||
                details?.pickupAgent?.vendor?.name,
            }}
            title={`${[details?.pickupAgent?.name, details?.pickupAgent?.phone, details?.pickupAgent?.email, details?.pickupAgent?.remarks]?.filter((e) => e)?.join(" , ")} `}
          />
        </div>
      )}
      {/* Order Details */}
      {showOrderDetails && (
        <div className={"flex flex-col gap-1"}>
          <span className="text-base font-semibold">Order Details</span>
          <div className="grid grid-cols-2 text-sm text-gray-700">
            <div>
              <span className="text-xs text-gray-400">DOX</span>
              <div>{details?.isDox ? "DOX" : "Non-DOX"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Booked Date</span>
              <div>{moment(details?.bookedDate).format("YYYY-MM-DD")}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Tracking ID</span>
              <div>{details?.trackingID || "N/A"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Forwarding No.</span>
              <div>{details?.forwardingNumber || "N/A"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Service Provider</span>
              <div>{details?.serviceProvider || "N/A"}</div>
            </div>{" "}
            <div>
              <span className="text-xs text-gray-400">Carrier</span>
              <div>{details?.carrier || "N/A"}</div>
            </div>
          </div>
        </div>
      )}
      {/* Invoice Details */}
      {showInvoiceDetails && (
        <div className={"flex flex-col gap-1"}>
          <span className="text-base font-semibold">Invoice Details</span>
          <div className="grid grid-cols-2 text-sm text-gray-700">
            <div>
              <span className="text-xs text-gray-400">Invoice Date</span>
              <div>
                {details?.invoice?.invoiceDate
                  ? moment(details?.invoice?.invoiceDate).format("YYYY-MM-DD")
                  : "N/A"}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Invoice Number</span>
              <div>{details?.invoice?.invoiceNumber || "N/A"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Reference Number</span>
              <div>{details?.invoice?.referenceNumber || "N/A"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Invoice Type</span>
              <div>{details?.invoice?.invoiceType || "N/A"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Currency</span>
              <div>{details?.invoice?.currency || "N/A"}</div>
            </div>{" "}
            <div>
              <span className="text-xs text-gray-400">INCO Term</span>
              <div>{details?.invoice?.INCOTerms || "N/A"}</div>
            </div>
          </div>
        </div>
      )}
      {/* Trip details */}
      <div>
        <span className="text-base font-semibold block mb-2">Trip Details</span>
        <div className="flex items-start ml-1 h-[35px] whitespace-nowrap">
          <Timeline
            mode="right"
            items={[
              { label: capitalizeFirstLetter(details.sourceCountry) },
              {
                label: capitalizeFirstLetter(details.destinationCountry),
                color: "red",
              },
            ]}
          />
        </div>
      </div>
      {/* Courier Company */}
      <div>
        <span className="text-base font-semibold mb-2 block">
          Courier Company
        </span>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-md overflow-hidden">
            <ViewFile
              canPreview={false}
              name={[details?.vendor?.logo]}
              className="max-h-10 max-w-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-red-500">
              {details?.deliveryType?.name}
            </span>
            <span className="text-sm font-bold">
              {details?.vendor?.legalName || details?.vendor?.name}
            </span>
            <span className="text-xs text-gray-500">
              {getAddressHandler(details?.vendor?.address)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VendorAndTripDetails;

import React, { useContext, useEffect } from "react";
import { LoadingAnimation, PageTemplate, ViewFile } from "components";
import { PageLinks } from "constant";
import { KycContext } from "context";
import { useAuthorization, useQueryParams } from "hooks";
import { AppIconType, KycStatusEnum } from "interfaces";
import { useNavigate } from "react-router-dom";
import { getIconsHandler } from "utils";
import { Alert } from "antd";
import { KYC_MESSAGE } from "../helpers";
import moment from "moment";

function MyKycPage() {
  const { getMyKycHandler, isMyKycLoading, myKyc } = useContext(KycContext);
  const { kycStatus } = useAuthorization();
  const navigate = useNavigate();
  const isSubmitted = kycStatus !== KycStatusEnum.NOT_SUBMITTED;

  useEffect(() => {
    (async () => {
      if (isSubmitted) {
        await getMyKycHandler();
      } else {
        navigate(PageLinks.kyc.edit);
      }
    })();
  }, [isSubmitted]);

  const { getResponsiveBackLink } = useQueryParams();
  const message = KYC_MESSAGE?.[myKyc?.status];
  const EditIcon = getIconsHandler(AppIconType.EDIT);

  const badgeColor =
    {
      VERIFIED: "bg-green-100 text-green-600",
      PENDING: "bg-yellow-100 text-yellow-700",
      FAILED: "bg-red-100 text-red-600",
      REJECTED: "bg-red-100 text-red-600",
    }[myKyc?.status as keyof typeof badgeColor] || "bg-gray-100 text-gray-600";

  const getInitials = (name: string = "") => {
    const words = name.split(" ");
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageTemplate backLink={getResponsiveBackLink()} title="My KYC">
      {isMyKycLoading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <Alert
            showIcon
            type={
              myKyc?.status === "VERIFIED"
                ? "success"
                : myKyc?.status === "FAILED"
                  ? "error"
                  : "warning"
            }
            description={
              <div className="flex flex-col gap-1">
                <span>{message?.description}</span>
                {myKyc?.status !== KycStatusEnum.VERIFIED &&
                  myKyc?.adminRemarks && (
                    <span className="text-red-500">
                      Admin remarks: {myKyc?.adminRemarks}
                    </span>
                  )}
              </div>
            }
            message={
              <div className="flex items-center justify-between">
                <span>{message?.title}</span>
                {myKyc?.status !== KycStatusEnum.VERIFIED && (
                  <div
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(PageLinks.kyc.edit)}
                  >
                    <EditIcon />
                  </div>
                )}
              </div>
            }
          />

          <div className="rounded-xl border bg-white p-5 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col items-center gap-2 relative">
              {myKyc?.profileImage ? (
                <ViewFile name={[myKyc?.profileImage]} />
              ) : (
                <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-gray-100 text-gray-500 text-xl font-semibold">
                  {getInitials(myKyc?.legalName)}
                </div>
              )}
              <div className="font-medium text-lg">
                {myKyc?.legalName || "N/A"}
              </div>
              {myKyc?.phone ? (
                <div className="text-gray-500 text-sm">
                  Phone: {myKyc.phone}
                </div>
              ) : (
                <div className="text-gray-400 text-sm italic">Phone: N/A</div>
              )}
              <div
                className={`absolute top-0 right-0 px-3 py-1 text-xs rounded-full ${badgeColor}`}
              >
                {myKyc?.status || "STATUS"}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-semibold text-base border-b pb-1">
                Personal Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Gender" value={myKyc?.gender} />
                <Info
                  label="Date of Birth"
                  value={
                    myKyc?.dateOfBirth
                      ? moment(myKyc.dateOfBirth).format("YYYY-MM-DD")
                      : undefined
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-semibold text-base border-b pb-1">
                Document Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Document Type" value={myKyc?.documentType} />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <span className="text-sm text-gray-500">Front Image</span>
                    {myKyc?.frontImage ? (
                      <ViewFile name={[myKyc?.frontImage]} />
                    ) : (
                      <div className="rounded border mt-1 w-full h-32 flex items-center justify-center text-gray-400 text-sm">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-500">Back Image</span>
                    {myKyc?.backImage ? (
                      <ViewFile name={[myKyc?.backImage]} />
                    ) : (
                      <div className="rounded border mt-1 w-full h-32 flex items-center justify-center text-gray-400 text-sm">
                        N/A
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
}

function Info({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-base font-medium text-gray-800">
        {value || "N/A"}
      </span>
    </div>
  );
}

export default MyKycPage;

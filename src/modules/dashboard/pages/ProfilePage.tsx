import { Skeleton } from "antd";
import { PageTemplate, ViewFile } from "components";
import { CustomerContext } from "context";

import { useQueryParams } from "hooks";
import { AppIconType, IUser, ParamsNames, UserType } from "interfaces";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIconsHandler } from "utils";

function ProfilePage() {
  const params = useParams<ParamsNames>();
  const userType: any = params.TYPE;
  const id = params.ID;
  const { getResponsiveBackLink } = useQueryParams();
  const [isLoading, setLoading] = useState(false);

  const {
    getDetailsHandler: getCustomerDetailsHandler,
    details: customerDetails,
  } = useContext(CustomerContext);

  const isUser = userType == UserType.USER;
  useEffect(() => {
    (async () => {
      const query = {
        ...(isUser ? { customerID: id } : { vendorID: id }),
        havePagination: true,
      };
      setLoading(true);
      // context calls
      await Promise.all([getCustomerDetailsHandler(id)]);
      setLoading(false);
    })();
  }, [userType, id]);
  return (
    <div
      className={
        "grid sm:grid-cols-[400px_auto] grid-cols-1 sm:h-full h-auto overflow-y-scroll gap-5"
      }
    >
      <PageTemplate
        transparentPage
        backLink={getResponsiveBackLink()}
        title={
          isLoading ? "Profile" : isUser ? "User Profile" : "Vendor Profile"
        }
      >
        <div
          className={"flex flex-col gap-5 sm:h-full h-auto overflow-y-scroll"}
        >
          <UserDetails
            customerDetails={customerDetails}
            userType={userType}
            id={id}
            isLoading={isLoading}
          />
        </div>
      </PageTemplate>
    </div>
  );
}

const UserDetails = ({
  id,
  userType,
  customerDetails,
  isLoading,
}: {
  id: string;
  userType: UserType;
  customerDetails: IUser;
  isLoading?: boolean;
}) => {
  const CheckIcon = getIconsHandler(AppIconType.CHECK);
  const isCustomer = userType == UserType.USER;
  const details = (() => {
    return {
      profileImage: customerDetails?.profileImage,
      name: customerDetails?.name,
      email: customerDetails?.email,
    };
  })();
  if (isLoading) {
    return <Skeleton active />;
  }
  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex flex-col sm:py-2 py-5 items-center justify-center"}>
        <div className={"flex flex-col items-center gap-4"}>
          {details?.profileImage ? (
            <div
              className={
                "relative  h-20 w-20 max-h-20 max-w-20 rounded-full bg-ash-100"
              }
            >
              <ViewFile
                canPreview={false}
                name={[details?.profileImage]}
                className={
                  "sm:max-w-20 sm:max-h-20 max-h-28 max-w-28 rounded-full object-cover"
                }
              />
              <div
                className={
                  "absolute sm:bottom-[0px] bottom-1 right-1 bg-green-500 shadow-lg text-white rounded-full p-1 border-2 border-white"
                }
              >
                <CheckIcon className={"text-xs"} />
              </div>
            </div>
          ) : (
            <div className={"h-28 w-28 rounded-full bg-gray-200"}></div>
          )}
          <div className={"flex flex-col items-center"}>
            <span className={"text-xl font-medium"}>{details?.name}</span>
            <span className={"text-sm text-gray-500"}>
              {details?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;

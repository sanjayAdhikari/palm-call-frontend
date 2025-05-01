import React, { useContext } from "react";
import { MyButton, PageTemplate, Wallet } from "components";
import { useNavigate } from "react-router-dom";
import { useAuthorization } from "hooks";
import { AppIconType, KycStatusEnum } from "interfaces";
import { Alert, Progress } from "antd";
import { PageLinks } from "constant";
import {
  FindRateComponent,
  LoadBalanceComponent,
  WithdrawRequestComponent,
} from "../components";
import { useAppContext, WalletContext } from "context";
import { getIconsHandler } from "utils";

function DashboardPage() {
  const navigate = useNavigate();
  const { userDetails, kycStatus, isAdmin, isUser } = useAuthorization();
  const isVerified = kycStatus === KycStatusEnum.VERIFIED;
  const { myWallet, isMyWalletLoading } = useContext(WalletContext);
  const NotificationIcon = getIconsHandler(AppIconType.NOTIFICATION);
  const { count } = useAppContext();
  return (
    <PageTemplate>
      <div className={"flex flex-col"}>
        <div className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-4"}>
            <div className={" text-lg"}>
              Hi,{" "}
              <span className={"font-bold"}>{userDetails?.name?.first}</span>
            </div>
          </div>
          <div
            onClick={() => navigate(PageLinks.notification.list)}
            className={
              "relative bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-50"
            }
          >
            <NotificationIcon className={"text-[20px]"} />
            {count?.notificationCount > 0 && (
              <div
                className={
                  "absolute right-2 top-2 bg-red-600 h-3 w-3 rounded-full border border-white"
                }
              ></div>
            )}
          </div>
        </div>
        <div className={"max-w-[500px]"}>
          {/*wallet*/}
          <Wallet isMyWallet wallet={myWallet} isLoading={isMyWalletLoading} />
          {/* Balance Section */}
          {!isAdmin && (
            <div className={"grid grid-cols-2 gap-2 mt-2"}>
              <LoadBalanceComponent />
              <WithdrawRequestComponent />
            </div>
          )}
          {!isVerified && isUser && <VerifyAccountCard />}
          {isUser && <FindRateComponent />}
        </div>
      </div>
    </PageTemplate>
  );
}

const VerifyAccountCard = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full rounded-2xl mt-5 p-4 flex items-start justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Verify Your Account
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Complete your KYC verification to use all services.
        </p>
        <MyButton
          onClick={() => navigate(PageLinks.kyc.my)}
          color={"blue"}
          className={"rounded-full"}
          size={"middle"}
          name={"Verify Now"}
        />
      </div>

      <div className="">
        <Progress
          type="dashboard"
          percent={50}
          showInfo={false}
          strokeColor={{
            "0%": "#87d068",
            "50%": "#ffe58f",
            "100%": "#ffccc7",
          }}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

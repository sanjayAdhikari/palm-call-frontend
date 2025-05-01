import React, { useEffect } from "react";
import {
  AppIconType,
  IWallet,
  UserType,
  WalletOwnerTypeEnum,
} from "interfaces";
import { commaSeparator, getIconsHandler } from "utils";
import moment from "moment";
import WalletBG from "assets/walletbg.jpg";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "constant";
import { useApiManager } from "hooks";
import { useAppContext } from "context";

function Wallet({
  wallet,
  isLoading,
  isMyWallet,
  type,
  ownerType,
  ownerId,
}: {
  wallet?: IWallet;
  isLoading?: boolean;
  isMyWallet?: boolean;
  type?: "main" | "summery";
  ownerType?: WalletOwnerTypeEnum;
  ownerId?: string;
}) {
  const WalletIcon = getIconsHandler(AppIconType.WALLET);
  const navigate = useNavigate();
  const RightIcon = getIconsHandler(AppIconType.RIGHT_ARROW);
  const {
    showWalletBalance,
    handler: { setShowWalletBalance },
  } = useAppContext();
  const { getCustomerWalletDetailsHandler, customerWalletDetails } =
    useApiManager();

  const walletDetails = ownerId ? customerWalletDetails : wallet;

  useEffect(() => {
    (async () => {
      if (ownerId) {
        await getCustomerWalletDetailsHandler(ownerId, ownerType);
      }
    })();
  }, [ownerId]);

  if (type == "summery") {
    return (
      <div
        onClick={() => setShowWalletBalance(!showWalletBalance)}
        className={
          "flex items-center cursor-pointer select-none justify-between  p-2 rounded-md bg-gray-100"
        }
      >
        <div className={"flex items-center gap-2"}>
          <WalletIcon className={"text-xl"} />
          <div className={"flex flex-col"}>
            <span className={"text-black font-bold"}>NPR</span>
            <span className={"text-gray-500 text-xs"}>
              Total available balance
            </span>
          </div>
        </div>

        <div className={"flex items-center gap-2"}>
          <span className="text-lg font-bold">
            <span className={"text-sm"}>Rs.</span>{" "}
            <span>
              {showWalletBalance
                ? commaSeparator(walletDetails?.availableBalance || 0)
                : "XXXX"}
            </span>
          </span>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        backgroundImage: `url(${WalletBG})`,
      }}
      className="relative flex bg-no-repeat  select-none bg-center bg-cover flex-col gap-5 p-5  rounded-3xl text-black"
    >
      <div className={"flex items-center gap-2"}>
        <WalletIcon className={"text-2xl"} />
        <span className="text-lg">Hyre Balance</span>
      </div>
      <div className={"flex items-end justify-between"}>
        <div
          className={"flex flex-col cursor-pointer"}
          onClick={() => setShowWalletBalance(!showWalletBalance)}
        >
          <span className="text-3xl font-bold">
            <span className={"text-xl"}>NPR</span>{" "}
            <span>
              {showWalletBalance
                ? commaSeparator(walletDetails?.availableBalance || 0.0)
                : "XXX"}
            </span>
          </span>
          <span className="text-xs">
            Last updated:{" "}
            {walletDetails?.lastBalanceAddedAt
              ? moment(walletDetails?.lastBalanceAddedAt).format(
                  "YYYY-MM-DD hh:mm A",
                )
              : "N/A"}
          </span>
        </div>
        {isMyWallet && (
          <div
            onClick={() => navigate(PageLinks.wallet.transaction)}
            className={"flex items-center text-xs font-medium cursor-pointer"}
          >
            <span>Transactions</span>
            <RightIcon />
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;

import React, { useContext, useEffect } from "react";
import {
  ConsigneeContext,
  OptionContext,
  useAppContext,
  WalletContext,
} from "context";
import { MyLoader } from "components";
import { message } from "antd";
import { getAccessToken, getRefreshToken } from "utils";
import { useAuthorization } from "hooks";
import { UserType } from "interfaces";

function Init({ children }) {
  const {
    isLoading,
    isAuthenticated,
    isAuthenticating,
    handler: { getCurrentHandler, setAuthenticating, getCountHandler },
  } = useAppContext();
  const { currentRole } = useAuthorization();
  const {
    handlers: {
      getDeliveryTypeOptions,
      getBadgeOptions,
      getVendorOptions,
      getCouponOptions,
      getCommodityOptions,
      getDeliveryPartnerOptions,
    },
  } = useContext(OptionContext);
  const { getListHandler: getConsigneeHandler } = useContext(ConsigneeContext);
  const { getMyWalletHandler } = useContext(WalletContext);
  useEffect(() => {
    (async () => {
      if (getAccessToken() && getRefreshToken()) {
        await getCurrentHandler();
      } else {
        setAuthenticating(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) return;
      const isAdmin = currentRole === UserType.HYRE;
      const isUser = currentRole === UserType.USER;
      const isCargo = currentRole === UserType.INTERNATIONAL_CARGO_VENDOR;
      await Promise.all([
        ...(isAdmin
          ? [getBadgeOptions(), getVendorOptions(), getDeliveryTypeOptions()]
          : isAdmin || isCargo
            ? [getDeliveryPartnerOptions(), getDeliveryTypeOptions()]
            : isUser
              ? [getConsigneeHandler()]
              : []),

        getCommodityOptions(),
        getCouponOptions(),
        getCountHandler(),
        getMyWalletHandler(),
      ]);
    })();
  }, [isAuthenticated]);

  return (
    <>
      {children}
      {(isLoading || isAuthenticating) && <MyLoader />}
      <MessagePopUp />
    </>
  );
}
const MessagePopUp = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    isError,
    isSuccess,
    error: errorMessage,
    successMessage,
    handler,
  } = useAppContext();

  useEffect(() => {
    if (isSuccess && successMessage) {
      success();
    }
    if (isError && errorMessage) {
      error();
    }
  }, [isSuccess, isError, successMessage, errorMessage]);

  const success = () => {
    messageApi.open({
      type: "success",
      content: successMessage,
      onClose: handler.clearSuccess,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: errorMessage,
      onClose: handler.clearError,
    });
  };

  return <>{contextHolder}</>;
};

export default Init;

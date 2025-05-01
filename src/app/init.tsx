import { message } from "antd";
import { MyLoader } from "components";
import {
  OptionContext,
  useAppContext,
} from "context";
import { useAuthorization } from "hooks";
import { UserType } from "interfaces";
import React, { useContext, useEffect } from "react";
import { getAccessToken, getRefreshToken } from "utils";

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
      await Promise.all([
        // getCommodityOptions(),
        // getCouponOptions(),
        // getCountHandler(),
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

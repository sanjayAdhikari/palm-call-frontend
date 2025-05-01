import { message } from "antd";
import { MyLoader } from "components";
import { useAppContext } from "context";
import { useAuthorization } from "hooks";
import React, { useEffect } from "react";
import { getAccessToken } from "utils";

function Init({ children }) {
  const {
    isLoading,
    isAuthenticated,
    isAuthenticating,
    handler: { getCurrentHandler, setAuthenticating, getCountHandler },
  } = useAppContext();
  const { currentRole } = useAuthorization();

  useEffect(() => {
    (async () => {
      if (getAccessToken()) {
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

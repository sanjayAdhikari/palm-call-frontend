import React from "react";
import AppContextProvider, { useAppContext } from "./AppContext";
import CustomerContextProvider, { CustomerContext } from "./CustomerContext";
import NotificationContextProvider, {
  NotificationContext,
} from "./NotificationContext";
import UtilityContextProvider, { UtilityContext } from "./UtilityContext";

export default function AppContext({ children }) {
  return (
    <AppContextProvider>
      <NotificationContextProvider>
        <UtilityContextProvider>
          <CustomerContextProvider>{children}</CustomerContextProvider>
        </UtilityContextProvider>
      </NotificationContextProvider>
    </AppContextProvider>
  );
}

export {
  useAppContext,
  CustomerContext,
  UtilityContext,
  NotificationContext,
};

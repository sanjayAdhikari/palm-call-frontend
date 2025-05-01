import React from "react";
import AppContextProvider, { useAppContext } from "./AppContext";
import CustomerContextProvider, { CustomerContext } from "./CustomerContext";
import NotificationContextProvider, {
  NotificationContext,
} from "./NotificationContext";
import OptionContextProvider, { OptionContext } from "./OptionContext";
import UtilityContextProvider, { UtilityContext } from "./UtilityContext";

export default function AppContext({ children }) {
  return (
    <AppContextProvider>
      <OptionContextProvider>
        <NotificationContextProvider>
          <UtilityContextProvider>
            <CustomerContextProvider>{children}</CustomerContextProvider>
          </UtilityContextProvider>
        </NotificationContextProvider>
      </OptionContextProvider>
    </AppContextProvider>
  );
}

export {
  useAppContext,
  CustomerContext,
  UtilityContext,
  NotificationContext,
  OptionContext,
};

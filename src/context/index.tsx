import AppContextProvider, { useAppContext } from "./AppContext";
import OptionContextProvider, { OptionContext } from "./OptionContext";
import ConsigneeContextProvider, { ConsigneeContext } from "./ConsigneeContext";
import WalletContextProvider, { WalletContext } from "./WalletContext";
import UtilityContextProvider, { UtilityContext } from "./UtilityContext";
import WithdrawContextProvider, { WithdrawContext } from "./WithdrawContext";
import NotificationContextProvider, {
  NotificationContext,
} from "./NotificationContext";
import RatingContextProvider, { RatingContext } from "./RatingContext";
import RefundContextProvider, { RefundContext } from "./RefundContext";
import TransactionContextProvider, {
  TransactionContext,
} from "./TransactionContext";
import CustomerContextProvider, { CustomerContext } from "./CustomerContext";
import OrderContextProvider, { OrderContext } from "./OrderContext";
import VendorContextProvider, { VendorContext } from "./VendorContext";
import KycContextProvider, { KycContext } from "./KycContext";
import React from "react";

export default function AppContext({ children }) {
  return (
    <AppContextProvider>
      <OptionContextProvider>
        <NotificationContextProvider>
          <TransactionContextProvider>
            <CustomerContextProvider>
              <OrderContextProvider>
                <KycContextProvider>
                  <RatingContextProvider>
                    <WalletContextProvider>
                      <RefundContextProvider>
                        <ConsigneeContextProvider>
                          <UtilityContextProvider>
                            <WithdrawContextProvider>
                              <VendorContextProvider>
                                {children}
                              </VendorContextProvider>
                            </WithdrawContextProvider>
                          </UtilityContextProvider>
                        </ConsigneeContextProvider>
                      </RefundContextProvider>
                    </WalletContextProvider>
                  </RatingContextProvider>
                </KycContextProvider>
              </OrderContextProvider>
            </CustomerContextProvider>
          </TransactionContextProvider>
        </NotificationContextProvider>
      </OptionContextProvider>
    </AppContextProvider>
  );
}

export {
  useAppContext,
  OrderContext,
  TransactionContext,
  CustomerContext,
  RefundContext,
  NotificationContext,
  WithdrawContext,
  UtilityContext,
  WalletContext,
  ConsigneeContext,
  OptionContext,
  RatingContext,
  KycContext,
  VendorContext,
};

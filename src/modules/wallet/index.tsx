import React from "react";
import { Route } from "react-router-dom";
import {
  PaymentStatusPage,
  RefundPage,
  TransactionDetailsPage,
  TransactionPage,
  WithdrawRequestPage,
} from "./pages";
import { ParamsNames } from "interfaces";
import { PageTransition } from "components";

function Index() {
  return (
    <Route path={"wallet/"}>
      <Route
        path={"transactions"}
        element={
          <PageTransition>
            <TransactionPage />
          </PageTransition>
        }
      />
      <Route
        path={`transactions/details/:${ParamsNames.ID}`}
        element={
          <PageTransition transactionType={"slideRightFade"}>
            <TransactionDetailsPage />
          </PageTransition>
        }
      />
      <Route path={`payment/status`} element={<PaymentStatusPage />} />
      <Route
        path={`withdraw-requests`}
        element={
          <PageTransition>
            <WithdrawRequestPage />
          </PageTransition>
        }
      />{" "}
      <Route
        path={`refunds`}
        element={
          <PageTransition>
            <RefundPage />
          </PageTransition>
        }
      />
    </Route>
  );
}

export default Index;

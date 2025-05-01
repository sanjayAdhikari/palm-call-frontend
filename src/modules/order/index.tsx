import React from "react";
import { Route } from "react-router-dom";
import {
  ActivityDetailsPage,
  ActivityPage,
  EditFITPage,
  NewRequestPage,
  SupportChatPage,
  SupportPage,
  WayBillDetailsPage,
} from "./pages";
import ContextProvider from "./context";
import { ParamsNames, UserType } from "interfaces";
import { AccessComponent, PageTransition } from "components";
import "./style.css";

function Index() {
  return (
    <Route path={"order/"} element={<ContextProvider />}>
      <Route path={"track"} element={<WayBillDetailsPage />} />
      <Route
        path={"shipment-request"}
        element={
          <PageTransition>
            <AccessComponent accessBy={[UserType.USER]}>
              <NewRequestPage />
            </AccessComponent>
          </PageTransition>
        }
      />
      <Route
        path={"create-fit"}
        element={
          <AccessComponent accessBy={[UserType.INTERNATIONAL_CARGO_VENDOR]}>
            <EditFITPage />
          </AccessComponent>
        }
      />{" "}
      <Route
        path={`edit-fit/:${ParamsNames.ID}`}
        element={
          <AccessComponent
            accessBy={[UserType.INTERNATIONAL_CARGO_VENDOR, UserType.HYRE]}
          >
            <EditFITPage />
          </AccessComponent>
        }
      />
      <Route
        path={"activity"}
        element={
          <PageTransition>
            <ActivityPage />
          </PageTransition>
        }
      >
        <Route path={``} element={<ActivityDetailsPage />} />
      </Route>
      <Route
        path={`activity/details/:${ParamsNames.ID}`}
        element={
          <PageTransition transactionType={"slideRightFade"}>
            <ActivityDetailsPage />
          </PageTransition>
        }
      />{" "}
      <Route
        path={"support"}
        element={
          <PageTransition>
            <SupportPage />
          </PageTransition>
        }
      >
        <Route path={``} element={<SupportChatPage />} />
      </Route>
      <Route
        path={`support/details`}
        element={
          <PageTransition transactionType={"slideRightFade"}>
            <SupportChatPage />
          </PageTransition>
        }
      />
    </Route>
  );
}

export default Index;

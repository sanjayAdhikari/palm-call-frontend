import React from "react";
import { Route } from "react-router-dom";
import { EditKycPage, KYCDetailsPage, KYCPage, MyKycPage } from "./pages";
import { ParamsNames, UserType } from "interfaces";
import { AccessComponent, PageTransition } from "components";

function Index() {
  return (
    <Route path="/kyc">
      <Route
        path={""}
        element={
          <AccessComponent accessBy={[UserType.HYRE]}>
            <KYCPage />
          </AccessComponent>
        }
      >
        <Route
          path={``}
          element={
            <AccessComponent accessBy={[UserType.HYRE]}>
              <KYCDetailsPage />
            </AccessComponent>
          }
        />
      </Route>
      <Route
        path={`details/:${ParamsNames.ID}`}
        element={
          <AccessComponent accessBy={[UserType.HYRE]}>
            <KYCDetailsPage />
          </AccessComponent>
        }
      />
      <Route
        path={"my"}
        element={
          <PageTransition>
            <AccessComponent accessBy={[UserType.USER]}>
              <MyKycPage />
            </AccessComponent>
          </PageTransition>
        }
      />
      <Route
        path={"edit"}
        element={
          <AccessComponent accessBy={[UserType.USER]}>
            <EditKycPage />
          </AccessComponent>
        }
      />
    </Route>
  );
}

export default Index;

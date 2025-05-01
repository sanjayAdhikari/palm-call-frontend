import React from "react";
import { Route } from "react-router-dom";
import { EditCourierRatePage, EditVendorPage, VendorPage } from "./pages";
import ContextProvider from "./context";
import { ParamsNames, UserType } from "interfaces";
import { AccessComponent } from "components";

function Index() {
  return (
    <Route path={"vendor/"} element={<ContextProvider />}>
      <Route
        path={""}
        element={
          <AccessComponent accessBy={[UserType.HYRE]}>
            <VendorPage />
          </AccessComponent>
        }
      />
      <Route
        path={"create"}
        element={
          <AccessComponent accessBy={[UserType.HYRE]}>
            <EditVendorPage />
          </AccessComponent>
        }
      />
      <Route
        path={`edit/:${ParamsNames.ID}`}
        element={
          <AccessComponent accessBy={[UserType.HYRE]}>
            <EditVendorPage />
          </AccessComponent>
        }
      />
      <Route
        path={`courier-rate`}
        element={
          <AccessComponent
            accessBy={[UserType.HYRE, UserType.INTERNATIONAL_CARGO_VENDOR]}
          >
            <EditCourierRatePage />
          </AccessComponent>
        }
      />
    </Route>
  );
}

export default Index;

import React from "react";
import { Route } from "react-router-dom";
import {
  DashboardPage,
  MorePage,
  NotificationPage,
  ProfilePage,
} from "./pages";
import { PageTransition } from "components";
import { ParamsNames } from "interfaces";

function Index() {
  return (
    <Route path="/">
      <Route path={"dashboard"} element={<DashboardPage />} />
      <Route
        path={`user/profile/:${ParamsNames.TYPE}/:${ParamsNames.ID}`}
        element={<ProfilePage />}
      />
      <Route
        path={"notifications"}
        element={
          <PageTransition transactionType={"slideRightFade"}>
            <NotificationPage />
          </PageTransition>
        }
      />
      <Route
        path={"more"}
        element={
          <PageTransition transactionType={"slideRightFade"}>
            <MorePage />
          </PageTransition>
        }
      />
    </Route>
  );
}

export default Index;

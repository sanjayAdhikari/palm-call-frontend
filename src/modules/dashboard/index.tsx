import { PageTransition } from "components";
import { ParamsNames } from "interfaces";
import React from "react";
import { Route } from "react-router-dom";
import ContextProvider from "./context";
import {
  DashboardPage,
  MorePage,
  NotificationPage,
  ProfilePage,
} from "./pages";
import SupportChatPage from "./pages/ChatPage";

function Index() {
  return (
    <Route path="/" element={<ContextProvider />}>
      <Route
        path={"dashboard"}
        element={
          <PageTransition>
            <DashboardPage />
          </PageTransition>
        }
      >
        <Route path={``} element={<SupportChatPage />} />
      </Route>
      <Route
        path={`dashboard/details`}
        element={
          <PageTransition transactionType={"slideRightFade"}>
            <SupportChatPage />
          </PageTransition>
        }
      />

      {/*<Route path={"dashboard"} element={<DashboardPage />} />*/}
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

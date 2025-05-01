import { PageTransition } from "components";
import React from "react";
import { Route } from "react-router-dom";
import { AuthContextProvider } from "./context";
import { LoginPage } from "./pages";

function Index() {
  return (
    <Route path="/" element={<AuthContextProvider />}>
      <Route
        path={""}
        element={
          <PageTransition>
            <LoginPage />
          </PageTransition>
        }
      />
    </Route>
  );
}

export default Index;

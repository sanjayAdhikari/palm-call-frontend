import React from "react";
import { Route } from "react-router-dom";
import { CustomerPage } from "./pages";

function Index() {
  return <Route path={`customers`} element={<CustomerPage />} />;
}

export default Index;

import React, { Suspense } from "react";
import { Layout, MyLoader } from "components";
import { AuthRoute } from "routes";
import "./index.css";
import "antd/dist/reset.css";
import AppContext from "context";
import Init from "./init";

const App = () => {
  return (
    <Suspense fallback={<MyLoader />}>
      <AppContext>
        <Init>
          <Layout>{AuthRoute()}</Layout>
        </Init>
      </AppContext>
    </Suspense>
  );
};

export default App;

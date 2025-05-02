import { Layout, MyLoader } from "components";
import AppContext from "context";
import React, { Suspense } from "react";
import { AuthRoute } from "routes";
import "./index.css";
import "antd/dist/reset.css";
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

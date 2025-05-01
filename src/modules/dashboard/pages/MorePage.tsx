import React from "react";
import { PageTemplate, NavProfileContent } from "components";

import { PageLinks } from "constant";

function MorePage() {
  return (
    <PageTemplate title={"More"} backLink={PageLinks.dashboard.list}>
      <NavProfileContent showMoreNavLink />
    </PageTemplate>
  );
}

export default MorePage;

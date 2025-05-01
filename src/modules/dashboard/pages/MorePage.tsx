import { NavProfileContent, PageTemplate } from "components";

import { PageLinks } from "constant";
import React from "react";

function MorePage() {
  return (
    <PageTemplate title={"More"} backLink={PageLinks.dashboard.list}>
      <NavProfileContent showMoreNavLink />
    </PageTemplate>
  );
}

export default MorePage;

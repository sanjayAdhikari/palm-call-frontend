import React, { useContext, useEffect } from "react";
import {
  EmptyMessageComponent,
  LoadingAnimation,
  PageTemplate,
} from "components";
import { PageLinks } from "constant";
import { ParamsNames } from "interfaces";
import { TransactionContext } from "context";
import { useNavigate, useParams } from "react-router-dom";
import { TransactionDetails } from "../components";

function TransactionDetailsPage() {
  const { isDetailsLoading, details, getDetailsHandler } =
    useContext(TransactionContext);
  const params = useParams<ParamsNames>();
  const id = params.ID;

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!id) return;
      await getDetailsHandler(id);
    })();
  }, [id]);

  return (
    <PageTemplate
      backLink={PageLinks.wallet.transaction}
      title={"Transactions Details"}
    >
      <div className={"w-full flex items-center justify-center h-full"}>
        <div className={"sm:w-[800px] w-full  h-full mt-10"}>
          {isDetailsLoading ? (
            <div>
              <LoadingAnimation />
            </div>
          ) : !details ? (
            <div>
              <EmptyMessageComponent message={"Transaction not found."} />
            </div>
          ) : (
            <TransactionDetails details={details} />
          )}
        </div>
      </div>
    </PageTemplate>
  );
}

export default TransactionDetailsPage;

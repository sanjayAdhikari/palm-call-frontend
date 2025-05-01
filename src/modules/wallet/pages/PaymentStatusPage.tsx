import React, { useContext, useEffect } from "react";
import { getIconsHandler } from "utils";
import { AppIconType, QueryNames } from "interfaces";
import { MyButton } from "components";
import { TransactionDetails } from "../components";
import { TransactionContext } from "context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLinks } from "constant";

const PaymentStatusPage = () => {
  const [query] = useSearchParams();
  const status = query.get(QueryNames.STATUS); // 1: success, 2: failed
  const message = query?.get(QueryNames.MESSAGE);
  const id = query?.get(QueryNames.ID);
  const CheckIcon = getIconsHandler(AppIconType.CHECK_CIRCLE);
  const CrossIcon = getIconsHandler(AppIconType.CLOSE_FILL);
  const { details, getDetailsHandler, isDetailsLoading } =
    useContext(TransactionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (status != "1" || !id) return;
    (async () => {
      await getDetailsHandler(id);
    })();
  }, [status, id]);

  const isSuccess = status == "1" && id;

  return (
    <div className="h-full w-full flex items-center justify-center ">
      {isDetailsLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div
            className={
              "flex flex-col gap-5  bg-white p-5 rounded-md sm:max-w-[500px] min-w-[400px] w-full"
            }
          >
            <div className={"flex flex-col gap-2 items-center "}>
              {isSuccess ? (
                <CheckIcon className={"text-[3rem] text-green-500"} />
              ) : (
                <CrossIcon className={"text-[3rem] text-red-500"} />
              )}
              <span className={"font-medium text-lg"}>
                {isSuccess ? "Transaction Success" : "Transaction Failed"}{" "}
              </span>
            </div>
            {isSuccess ? (
              <TransactionDetails details={details} />
            ) : (
              <span className={"text-gray-500 text-center"}>
                {message || "Something went wrong"}
              </span>
            )}
            <div className={"border-t pt-5 border-dashed mt-2"}>
              <MyButton
                onClick={() => navigate(PageLinks.dashboard.list)}
                block
                name={"Done"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusPage;

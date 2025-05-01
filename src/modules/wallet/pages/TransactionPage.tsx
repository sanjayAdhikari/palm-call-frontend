import React, { useContext, useEffect } from "react";
import {
  FilterComponent,
  MyTable,
  PageTemplate,
  TransactionTableColumn,
} from "components";
import { PageLinks } from "constant";
import {
  GeneralStatusEnum,
  ITransaction,
  TransactionTypeEnum,
} from "interfaces";
import { TransactionContext } from "context";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useQueryParams, useScreenSize } from "hooks";
import { capitalizeFirstLetter, commaSeparator } from "utils";

function TransactionPage() {
  const { isLoading, lists, getListHandler, currentPage } =
    useContext(TransactionContext);
  const navigate = useNavigate();
  const { from, to } = useQueryParams();

  const fetchHandler = async ({ page }: { page: number }) => {
    await getListHandler({
      havePagination: true,
      page,
      startDate: from,
      endDate: to,
    });
  };

  useEffect(() => {
    (async () => {
      await fetchHandler({ page: 1 });
    })();
  }, [from, to]);

  const { getResponsiveBackLink } = useQueryParams();
  const { isSmScreen } = useScreenSize();
  const TableColumns = TransactionTableColumn();

  const formatDate = (date: string) => {
    const d = moment(date);
    return moment().diff(d, "days") < 1
      ? d.fromNow()
      : d.format("YYYY-MM-DD hh:mm A");
  };

  const renderMobileCard = (record: ITransaction) => {
    const isExpenses = record?.transactionType === TransactionTypeEnum.DR;
    const isDone = record?.transactionStatus === GeneralStatusEnum.DONE;
    const rippleStyles = {
      position: "relative",
      overflow: "hidden",
    };

    return (
      <div
        onClick={() =>
          navigate(PageLinks.wallet.transactionDetails(record?._id))
        }
        style={rippleStyles as React.CSSProperties}
        className="rounded-xl border p-4 bg-white shadow-sm flex flex-col gap-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600 uppercase">
            {capitalizeFirstLetter(record?.transactionStatus)}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate((record?.updatedAt ?? "").toString())}
          </span>
        </div>
        <div className="font-medium text-base text-gray-800">
          {record?.description}
        </div>
        <div className="text-sm text-gray-500">
          Balance: Rs.{commaSeparator(record?.atm?.mainBalance)}
        </div>
        <div
          className={`text-lg font-semibold ${isExpenses ? "text-red-500" : "text-green-500"}`}
        >
          Rs. {commaSeparator(record?.amount)}
        </div>
      </div>
    );
  };

  return (
    <PageTemplate backLink={getResponsiveBackLink()} title={"Transactions"}>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex justify-end"}>
          <FilterComponent onSubmitCB={(values) => {}} />
        </div>
        {isSmScreen ? (
          <div className="flex flex-col gap-3">
            {lists?.docs?.map((tx) => renderMobileCard(tx))}
          </div>
        ) : (
          <MyTable
            onRowClickHandler={(data, index) => {
              navigate(PageLinks.wallet.transactionDetails(data?._id));
            }}
            pagination={{
              currentPage: currentPage,
              totalDocs: lists?.totalDocs,
              onChange: async (page) => {
                await fetchHandler({
                  page: page,
                });
              },
            }}
            isLoading={isLoading}
            columns={TableColumns}
            data={lists?.docs}
          />
        )}
      </div>
    </PageTemplate>
  );
}

export default TransactionPage;

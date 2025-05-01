import React, { useContext, useEffect, useState } from "react";
import { MyTable, PageTemplate, UserProfileCard } from "components";
import { PageLinks } from "constant";
import { IReferral, ITableColumns } from "interfaces";
import { ReferralContext } from "../context";
import { useQueryParams } from "hooks";
import ReferralImage from "assets/referral.png";
import { useAppContext } from "context";
import moment from "moment";

function ReferralPage() {
  const { isLoading, lists, getListHandler } = useContext(ReferralContext);
  const { isActiveList } = useQueryParams();
  const {
    userDetails,
    handler: { setSuccess },
  } = useAppContext();
  const [code] = useState(userDetails?.referralCode);
  const { getResponsiveBackLink } = useQueryParams();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setSuccess("Code copied to clipboard!");
  };
  const fetchHandler = async () => {
    await getListHandler({
      toggleStatus: isActiveList ? "on" : "off",
    });
  };
  useEffect(() => {
    (async () => {
      await fetchHandler();
    })();
  }, [isActiveList]);

  const TableColumns: ITableColumns<IReferral>[] = [
    {
      title: "Date",
      render: (value, record) => {
        return <span>{moment(record?.createdAt).format("YYYY-MM-DD")}</span>;
      },
    },
    {
      title: "User",
      render: (value, record) => {
        return <UserProfileCard name={record?.referredUser?.name} />;
      },
    },
    {
      title: "Point Earned",
      render: (value, record) => {
        return (
          <span className={"text-green-500"}>{record?.referrerPoint}</span>
        );
      },
    },
  ];
  return (
    <PageTemplate backLink={getResponsiveBackLink()} title={"Refer Friend"}>
      <div className={"flex flex-col gap-5"}>
        <div className="flex flex-col gap-2 items-center p-6 bg-gray-100 rounded-md">
          <img src={ReferralImage} alt={"referral"} className={"h-[150px]"} />
          <div className={"flex flex-col items-center"}>
            <span className="text-lg font-semibold text-gray-700">
              Invite friends
            </span>
            <p className="text-sm text-gray-500">
              Copy your referral code, share it with your friends.
            </p>
            <div className="flex items-center border border-dashed border-gray-400 rounded-lg p-2 ">
              <span className="text-lg font-mono mr-2">{code}</span>
              <button
                onClick={handleCopy}
                className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className={""}>Referred Friends</h3>
          <MyTable
            isLoading={isLoading}
            columns={TableColumns}
            data={lists?.docs}
          />
        </div>
      </div>
    </PageTemplate>
  );
}

export default ReferralPage;

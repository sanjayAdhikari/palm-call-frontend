import React, { useContext, useEffect, useState } from "react";
import {
  EmptyMessageComponent,
  MySegmented,
  PageTemplate,
  UserProfileCard,
} from "components";
import { PageLinks } from "constant";
import { KycContext } from "context";
import { IKyc, KycStatusEnum, QueryNames } from "interfaces";
import { Outlet, useSearchParams } from "react-router-dom";
import { useQueryParams, useScreenSize } from "hooks";
import { capitalizeFirstLetter } from "utils";
import { Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

function KYCPage() {
  const [activeTab, setActiveTab] = useState<KycStatusEnum>(
    KycStatusEnum.PENDING,
  );
  const { getListHandler, lists, isLoading, currentPage } =
    useContext(KycContext);
  const { isSmScreen } = useScreenSize();
  useEffect(() => {
    (async () => {
      await getListHandler({
        ...(activeTab
          ? {
              status: activeTab,
            }
          : {}),
        page: 1,
        havePagination: true,
      });
    })();
  }, [activeTab]);
  const [query] = useSearchParams();
  const selectedId = query?.get(QueryNames.ID);
  const { goToKYCDetails } = useQueryParams();
  return (
    <div
      className={
        "grid sm:grid-cols-[400px_auto] grid-cols-1 h-full overflow-y-scroll gap-5"
      }
    >
      <PageTemplate
        transparentPage
        backLink={isSmScreen && PageLinks.dashboard.list}
        title={"KYC"}
      >
        <div className={"flex flex-col gap-5 h-full overflow-y-scroll"}>
          <div className={"flex items-center justify-center"}>
            <MySegmented
              activeTab={activeTab}
              setActiveTab={(value: any) => setActiveTab(value)}
              tabs={[
                {
                  key: KycStatusEnum.PENDING,
                  label: "Pending",
                },
                {
                  key: KycStatusEnum.REJECTED,
                  label: "Rejected",
                },
                {
                  key: KycStatusEnum.FAILED,
                  label: "Failed",
                },
                {
                  key: KycStatusEnum.VERIFIED,
                  label: "Verified",
                },
              ]}
            />
          </div>

          <div
            id="scrollableDiv"
            className={"flex flex-col h-full overflow-y-scroll hide-scrollbar"}
          >
            <InfiniteScroll
              next={async () => {
                await getListHandler({
                  havePagination: true,
                  page: currentPage + 1,
                  savePrevState: true,
                });
              }}
              scrollableTarget={"scrollableDiv"}
              hasMore={lists?.docs?.length < lists?.totalDocs}
              loader={
                <div className={"text-center text-xs text-gray-500"}>
                  Loading...
                </div>
              }
              dataLength={lists?.docs?.length || 0}
            >
              {isLoading ? (
                <div className={"flex flex-col gap-2 mt-1"}>
                  {new Array(5).fill("").map((e, key) => {
                    return (
                      <div key={key} className={"flex items-start gap-2"}>
                        <Skeleton.Avatar />
                        <Skeleton
                          active
                          paragraph={{ rows: 1, width: "full" }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : lists?.docs?.length < 1 ? (
                <div>
                  <EmptyMessageComponent />
                </div>
              ) : (
                lists?.docs?.map((kyc, key) => {
                  const isActive = kyc?._id === selectedId;
                  return (
                    <UserDetails
                      isActive={isActive}
                      details={kyc}
                      onClick={() => goToKYCDetails(kyc?._id)}
                      key={key}
                    />
                  );
                })
              )}
            </InfiniteScroll>
          </div>
        </div>
      </PageTemplate>
      <div className={"sm:block hidden h-full overflow-y-scroll"}>
        {selectedId ? (
          <Outlet />
        ) : (
          <div
            className={
              " h-full w-full rounded-3xl py-5 flex justify-center items-center text-gray-500"
            }
          >
            {lists?.docs?.length > 0 && (
              <span>Select a user card from the list on the left.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const UserDetails = ({
  details,
  onClick,
  isActive,
}: {
  details: IKyc;
  onClick: () => any;
  isActive?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col gap-1 rounded-lg cursor-pointer p-2  ${isActive ? "bg-ash-100 " : ""}`}
      onClick={onClick}
    >
      <div className={"flex items-center justify-between"}>
        <UserProfileCard
          name={{ first: capitalizeFirstLetter(details?.legalName) }}
        />
      </div>

      <span className={`text-xs `}>
        Submissions count: {details?.attemptedKYC || 1}
      </span>
    </div>
  );
};

export default KYCPage;

import React, { useContext, useEffect, useState } from "react";
import {
  EmptyMessageComponent,
  LoadingAnimation,
  MySegmented,
  MyTab,
  PageTemplate,
  UserIconPlaceholder,
} from "components";
import { PageLinks } from "constant";
import {
  AppIconType,
  ISupportThread,
  QueryNames,
  SupportChatStatusEnum,
  UserType,
} from "interfaces";
import { getIconsHandler } from "utils";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthorization, useQueryParams, useScreenSize } from "hooks";
import { SupportContext } from "../context";
import moment from "moment";
import { Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

function SupportPage() {
  const [activeTab, setActiveTab] = useState<SupportChatStatusEnum>(
    SupportChatStatusEnum.OPEN,
  );
  const { getListHandler, lists, isLoading, currentPage } =
    useContext(SupportContext);
  const { goToSupportDetails } = useQueryParams();

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
  const { isSmScreen } = useScreenSize();

  const activityId = query.get(QueryNames.ACTIVITY_ID);
  const threadId = query.get(QueryNames.THREAD_ID);
  const orderId = query.get(QueryNames.ORDER_ID);
  const showDetails = !isSmScreen && (activityId || threadId || orderId);
  return (
    <div
      className={
        "grid sm:grid-cols-[400px_auto] grid-cols-1 h-full overflow-y-scroll hide-scrollbar gap-5"
      }
    >
      <PageTemplate
        backLink={isSmScreen && PageLinks.dashboard.list}
        title={"Support"}
        transparentPage
      >
        <div
          className={
            "flex flex-col gap-2 h-full overflow-y-scroll hide-scrollbar"
          }
        >
          <div className={"flex justify-center"}>
            <MySegmented
              activeTab={activeTab}
              setActiveTab={(value: any) => setActiveTab(value)}
              tabs={[
                {
                  key: "",
                  label: "All",
                },
                {
                  key: SupportChatStatusEnum.OPEN,
                  label: "Open",
                },
                {
                  key: SupportChatStatusEnum.COMPLETED,
                  label: "Completed",
                },
                {
                  key: SupportChatStatusEnum.BLOCKED,
                  label: "Blocked",
                },
              ]}
            />
          </div>

          <div
            id="scrollableDiv"
            className={"flex flex-col h-full overflow-y-scroll"}
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
                <div className={"flex flex-col gap-2"}>
                  {new Array(4).fill("").map((e, key) => {
                    return <Skeleton active avatar key={key} />;
                  })}
                </div>
              ) : lists?.docs?.length < 1 ? (
                <div>
                  <EmptyMessageComponent message={"No record found"} />
                </div>
              ) : (
                lists?.docs?.map((thread, key) => {
                  const isActive =
                    thread?._id === threadId ||
                    thread?.activity?._id == activityId;
                  return (
                    <ThreadCard
                      isActive={isActive}
                      details={thread}
                      onClick={() => {
                        goToSupportDetails({
                          thread: thread?._id,
                        });
                      }}
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
        {showDetails ? (
          <Outlet />
        ) : (
          <div
            className={
              "bg-white h-full w-full rounded-3xl py-5 flex justify-center items-center text-gray-500"
            }
          >
            <span>Select a conversation from the list on the left.</span>
          </div>
        )}
      </div>
    </div>
  );
}

const ThreadCard = ({
  details,
  onClick,
  isActive,
}: {
  details: ISupportThread;
  onClick: () => any;
  isActive?: boolean;
}) => {
  const activity = details?.activity;
  const { currentRole } = useAuthorization();
  const isUser = currentRole === UserType.USER;

  const Name = (() => {
    return !isUser
      ? `${activity?.customer?.name?.first || ""} ${activity?.customer?.name?.last || ""}`
      : activity?.vendor?.name;
  })();
  //  name
  return (
    <div
      onClick={onClick}
      className={`flex flex-col py-3 cursor-pointer sm:px-3 px-0 w-full hover:bg-ash-100 rounded-lg ${isActive ? "bg-ash-100 " : ""}`}
    >
      <div className={"flex items-start gap-4"}>
        <div>
          <UserIconPlaceholder />
        </div>
        <div className={"flex justify-between gap-2 w-full "}>
          <div className={"flex flex-col gap-1 w-full"}>
            <div className={"flex items-center justify-between text-xs"}>
              <span className={"text-red-400 "}>
                {details?.activity?.activityID}
              </span>
              <span className={"text-ash-500"}>
                {moment(details?.lastMessageAt)?.format("DD MMM yyyy")}
              </span>
            </div>

            <span>{Name}</span>
            <span className={"text-xs text-ash-500 "}>
              {details?.lastMessage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

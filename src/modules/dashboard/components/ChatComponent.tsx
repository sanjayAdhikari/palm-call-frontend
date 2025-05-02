import { Skeleton } from "antd";
import {
  EmptyMessageComponent,
  PageTemplate,
  UserIconPlaceholder,
  ViewFile,
} from "components";
import { PageLinks } from "constant";
import { useAuthorization, useQueryParams, useScreenSize } from "hooks";
import { ISupportThread, IUser, QueryNames, UserType } from "interfaces";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Outlet, useSearchParams } from "react-router-dom";
import { ChatContext } from "../context";

function ChatComponent() {
  const { getListHandler, lists, isLoading, currentPage } =
    useContext(ChatContext);
  const { goToChatDetails } = useQueryParams();

  useEffect(() => {
    (async () => {
      await getListHandler({
        page: 1,
        havePagination: true,
      });
    })();
  }, []);
  const [query] = useSearchParams();
  const { isSmScreen } = useScreenSize();

  const activityId = query.get(QueryNames.ID);
  const showDetails = !isSmScreen && activityId;
  return (
    <div
      className={
        "grid sm:grid-cols-[400px_auto] grid-cols-1 h-full overflow-y-scroll hide-scrollbar gap-5"
      }
    >
      <PageTemplate
        backLink={isSmScreen && PageLinks.dashboard.chat}
        title={"Support"}
        transparentPage
      >
        <div
          className={
            "flex flex-col gap-2 h-full overflow-y-scroll hide-scrollbar"
          }
        >
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
                  <EmptyMessageComponent message={"No Chats found"} />
                </div>
              ) : (
                lists?.docs?.map((thread, key) => {
                  const isActive = thread?._id === activityId;
                  return (
                    <ThreadCard
                      isActive={isActive}
                      details={thread}
                      onClick={() => {
                        goToChatDetails(thread?._id);
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
  const { currentRole, currentUserId } = useAuthorization();
  const isUser = currentRole === UserType.USER;

  const otherParticipant: IUser = (() => {
    return details?.participants?.find((each) => each._id !== currentUserId);
  })();

  const Name = (() => {
    if (!otherParticipant) return "Unknown";
    return otherParticipant?.name;
  })();
  //  name
  return (
    <div
      onClick={onClick}
      className={`flex flex-col py-3 cursor-pointer sm:px-3 px-0 w-full hover:bg-ash-100 rounded-lg ${
        isActive ? "bg-ash-100 " : ""
      }`}
    >
      <div className={"flex items-start gap-4"}>
        {otherParticipant?.profileImage ? (
          <ViewFile
            canPreview={false}
            name={[otherParticipant?.profileImage]}
            className={
              "sm:max-w-8 sm:max-h-8 max-h-8 max-w-8 rounded-full object-cover"
            }
          />
        ) : (
          <div>
            <UserIconPlaceholder />
          </div>
        )}

        <div className={"flex justify-between gap-2 w-full "}>
          <div className={"flex flex-col gap-1 w-full"}>
            <div className={"flex items-center justify-between text-xs"}>
              <span className={"text-gray-500 text-lg"}>{Name}</span>
              <span className={"text-ash-500"}>
                {moment(details?.lastMessageAt)?.format("DD MMM yyyy")}
              </span>
            </div>
            <span className={"text-xs text-ash-500 "}>
              {details?.lastMessage?.message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  EmptyMessageComponent,
  MyButton,
  MySegmented,
  PageTemplate,
  UserProfileCard,
} from "components";
import { ActivityContext } from "../context";
import {
  IOrder,
  IPaginateData,
  PackageStatusEnum,
  QueryNames,
  UserType,
} from "interfaces";
import { capitalizeFirstLetter, getPackageStatusColor } from "utils";
import { Outlet, useSearchParams } from "react-router-dom";
import { useAuthorization, useQueryParams, useScreenSize } from "hooks";
import { Skeleton, Timeline } from "antd";
import moment from "moment";
import { useAppContext, OrderContext } from "context";
import { PageLinks } from "constant";
import InfiniteScroll from "react-infinite-scroll-component";

enum ActivityType {
  ALL = "",
  PENDING = "PENDING",
  ON_GOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

function ActivityPage() {
  const [activeTab, setActiveTab] = useState<ActivityType>(
    ActivityType.PENDING,
  );
  const { currentRole } = useAuthorization();
  const [query] = useSearchParams();
  const selectedId = query.get(QueryNames.ID); // can be activity id or package id
  const { isSmScreen } = useScreenSize();
  const {
    getListHandler: getActivityHandler,
    lists: activityList,
    isLoading: isActivityLoading,
    currentPage: activityCurrentPage,
  } = useContext(ActivityContext);
  const {
    getListHandler: getPackageHandler,
    isLoading: isPackageLoading,
    lists: packageList,
    currentPage: orderCurrentPage,
  } = useContext(OrderContext);
  const { goToActivityDetails } = useQueryParams();
  const currentPage =
    currentRole === UserType.USER ? activityCurrentPage : orderCurrentPage;
  // Memoized values
  const isUser = useMemo(() => currentRole === UserType.USER, [currentRole]);
  const pageType = useMemo(() => (isUser ? "activity" : "package"), [isUser]);

  const orderLists: IPaginateData<IOrder> = (() => {
    let data: IPaginateData<IOrder>;
    if (currentRole === UserType.USER) {
      data = {
        ...activityList,
        docs: activityList?.docs?.map((e) => e?.courier?.order),
      };
    } else {
      data = {
        ...packageList,
        docs: packageList?.docs,
      };
    }
    return data;
  })();
  // Fetch data handler
  const getListHandler = useCallback(
    async ({
      page,
      savePrevState,
    }: {
      page?: number;
      savePrevState?: boolean;
    }) => {
      try {
        let paginateQuery = {
          page,
          savePrevState,
          havePagination: true,
        };
        if (isUser) {
          await getActivityHandler({
            ...paginateQuery,
          });
        } else {
          await getPackageHandler(
            activeTab == ActivityType.ALL
              ? { ...paginateQuery }
              : { category: activeTab, ...paginateQuery },
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [activeTab, isUser, getActivityHandler, getPackageHandler],
  );

  useEffect(() => {
    (async () => {
      await getListHandler({ page: 1 });
    })();
  }, [activeTab]);

  const isLoading = isActivityLoading || isPackageLoading;
  return (
    <div
      className={
        "grid sm:grid-cols-[400px_auto] grid-cols-1 h-full overflow-y-scroll gap-5"
      }
    >
      <PageTemplate
        backLink={isSmScreen && PageLinks.dashboard.list}
        transparentPage
        title={isUser ? "Activity" : "Orders"}
      >
        <div
          className={
            "flex flex-col gap-2 h-full overflow-y-scroll hide-scrollbar"
          }
        >
          {!isUser && (
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
                    key: ActivityType.PENDING,
                    label: "Pending",
                  },
                  {
                    key: ActivityType.ON_GOING,
                    label: "On going",
                  },
                  {
                    key: ActivityType.COMPLETED,
                    label: "Completed",
                  },
                  {
                    key: ActivityType.CANCELLED,
                    label: "Cancelled",
                  },
                ]}
              />
            </div>
          )}
          <div
            id="scrollableDiv"
            className={"flex flex-col overflow-y-scroll hide-scrollbar"}
          >
            <InfiniteScroll
              next={async () => {
                await getListHandler({
                  page: currentPage + 1,
                  savePrevState: true,
                });
              }}
              scrollableTarget={"scrollableDiv"}
              hasMore={orderLists?.docs?.length < orderLists?.totalDocs}
              loader={
                <div className={"text-center text-xs text-gray-500"}>
                  Loading...
                </div>
              }
              dataLength={orderLists?.docs?.length || 0}
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
              ) : orderLists?.docs?.length < 1 ? (
                <div>
                  <EmptyMessageComponent />
                </div>
              ) : (
                orderLists?.docs?.map((order, key) => {
                  const id =
                    pageType == "activity"
                      ? activityList?.docs?.[key]?._id
                      : order?._id;
                  const isActive = id === selectedId;
                  return (
                    <ActivityCard
                      isActive={isActive}
                      details={order}
                      onClick={() => goToActivityDetails(id)}
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
            {orderLists?.docs?.length > 0 && (
              <span>Select a activity from the list on the left.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const ActivityCard = ({
  details,
  onClick,
  isActive,
}: {
  details: IOrder;
  onClick: () => any;
  isActive?: boolean;
}) => {
  const {
    handler: { setSuccess },
  } = useAppContext();
  const { currentRole } = useAuthorization();
  const isVendor = currentRole === UserType.INTERNATIONAL_CARGO_VENDOR;
  const isUser = currentRole === UserType.USER;
  const statusLabel =
    isVendor && details?.status === PackageStatusEnum.SHIPMENT_ORDERED
      ? "Order request"
      : capitalizeFirstLetter(details?.status);
  const statusColor = getPackageStatusColor(details?.status);
  return (
    <div
      onClick={onClick}
      className={`flex flex-col py-3 cursor-pointer sm:px-3 px-0 w-full hover:bg-ash-100 rounded-lg ${isActive ? "bg-ash-100 " : ""}`}
    >
      <div className={"flex items-start mb-1 justify-between"}>
        <div className={"flex items-center gap-2"}>
          {!isUser && (
            <div
              className={`${details?.isFIT ? "bg-gray-300" : "bg-black"}  text-white text-center text-xs  p-1 px-2`}
            >
              {details?.isFIT ? "Manual" : "Hyre"}
            </div>
          )}
          <MyButton
            onClick={() => {
              navigator.clipboard.writeText(details?.wayBillNumber);
              setSuccess("Copied");
            }}
            name={details?.wayBillNumber}
            size={"small"}
            variant={"outlined"}
          />
        </div>
        <div className={"flex items-end flex-col"}>
          <span
            style={{
              color: statusColor,
            }}
            className={"text-xs "}
          >
            {statusLabel}
          </span>
          <span className={"text-xs font-medium"}>
            {moment(details?.bookedDate).format("DD MMM, YYYY")}
          </span>
        </div>
      </div>
      <UserProfileCard
        // hideProfile={isUser}
        title={
          isUser ? details?.deliveryType?.name : details?.vendor?.legalName
        }
        name={{
          first: isUser
            ? details?.vendor?.legalName
            : details?.customer?.name?.first,
          last: isUser ? "" : details?.customer?.name?.last,
        }}
      />
      {/*src-dest country*/}
      <div
        className={
          "flex items-start w-full mt-2 ml-1  whitespace-nowrap h-[30px]"
        }
      >
        <Timeline
          mode={"right"}
          items={[
            {
              label: capitalizeFirstLetter(details.sourceCountry),
            },
            {
              label: capitalizeFirstLetter(details.destinationCountry),
              color: "red",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ActivityPage;

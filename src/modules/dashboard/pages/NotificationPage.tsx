import { Skeleton } from "antd";

import Logo from "assets/logo.jpg";
import {
  EmptyMessageComponent,
  FilterComponent,
  PageTemplate,
} from "components";
import { PageLinks } from "constant";
import { NotificationContext } from "context";
import { useQueryParams } from "hooks";
import {
  AppIconType,
  INotification,
  NotificationCategoryEnum,
} from "interfaces";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIconsHandler } from "utils";

function NotificationPage() {
  const { isLoading, lists, getListHandler } = useContext(NotificationContext);
  const { from, to } = useQueryParams();

  useEffect(() => {
    (async () => {
      await getListHandler({
        startDate: from,
        endDate: to,
      });
    })();
  }, [from, to]);
  return (
    <PageTemplate backLink={PageLinks.dashboard.chat} title={"Notification"}>
      <div className={"flex flex-col gap-2 w-full"}>
        <div className={"flex justify-end"}>
          <FilterComponent />
        </div>
        {isLoading ? (
          new Array(4).fill("").map((e, key) => {
            return <Skeleton key={key} avatar active />;
          })
        ) : lists?.docs?.length < 1 ? (
          <EmptyMessageComponent message={"No notifications"} />
        ) : (
          <div className={"flex flex-col"}>
            {lists?.docs?.map((e) => {
              return <NotificationCard key={e?._id} details={e} />;
            })}
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

const NotificationCard = ({ details }: { details: INotification }) => {
  const navigate = useNavigate();
  const Icon = (() => {
    switch (details?.category) {
      case NotificationCategoryEnum.SYSTEM:
        return getIconsHandler(AppIconType.WALLET);
      case NotificationCategoryEnum.CHAT:
        return getIconsHandler(AppIconType.SUPPORT);
      default:
        return getIconsHandler(AppIconType.SUPPORT);
    }
  })();
  const { goToChatDetails } = useQueryParams();


  const onRedirectHandler = () => {
    switch (details?.category) {
      case NotificationCategoryEnum.CHAT:
        return goToChatDetails(details?.payload?.threadID);
      default:
        return;
    }
  };

  const canRedirect = !!details?.payload?.threadID;

  return (
    <div
      onClick={canRedirect ? onRedirectHandler : undefined}
      className={`px-4 py-2 rounded-3xl ${canRedirect ? "hover:bg-gray-50 cursor-pointer" : ""}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          {details?.category === NotificationCategoryEnum.SYSTEM ? (
            <img
              src={Logo}
              alt={"logo"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Icon className="w-5 h-5 text-gray-600" />
          )}
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-gray-800 text-sm line-clamp-2">
              {details.title}
            </span>
            {!details.hasRead && (
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
            )}
          </div>
          <span className="text-sm text-gray-600  line-clamp-3">
            {details.body}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {moment(details.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotificationPage;

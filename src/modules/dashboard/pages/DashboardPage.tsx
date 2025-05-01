import { PageTemplate } from "components";
import { PageLinks } from "constant";
import { useAppContext } from "context";
import { useAuthorization } from "hooks";
import { AppIconType } from "interfaces";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getIconsHandler } from "utils";

function DashboardPage() {
  const navigate = useNavigate();
  const { userDetails } = useAuthorization();
  const NotificationIcon = getIconsHandler(AppIconType.NOTIFICATION);
  const { count } = useAppContext();
  return (
    <PageTemplate>
      <div className={"flex flex-col"}>
        <div className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-4"}>
            <div className={"font-bold text-lg"}>Chats</div>
          </div>
          <div
            onClick={() => navigate(PageLinks.notification.list)}
            className={
              "relative bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-50"
            }
          >
            <NotificationIcon className={"text-[20px]"} />
            {count?.notificationCount > 0 && (
              <div
                className={
                  "absolute right-2 top-2 bg-red-600 h-3 w-3 rounded-full border border-white"
                }
              ></div>
            )}
          </div>
        </div>
        <div className={"max-w-[500px]"}>Dashboard Detail</div>
      </div>
    </PageTemplate>
  );
}

export default DashboardPage;

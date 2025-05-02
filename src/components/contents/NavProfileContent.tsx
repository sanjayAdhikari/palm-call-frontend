import { EditUserProfile, ViewFile } from "components";
import { NavLink } from "constant";
import { useAppContext } from "context";
import { useAuthorization, useScreenSize } from "hooks";
import { AppIconType } from "interfaces";
import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { getIconsHandler } from "utils";

function NavProfileContent({ showMoreNavLink }: { showMoreNavLink?: boolean }) {
  const {
    handler: { logoutHandler },
  } = useAppContext();
  const EditIcon = getIconsHandler(AppIconType.EDIT);
  const { userDetails } = useAppContext();
  const LogoutIcon = getIconsHandler(AppIconType.LOGOUT);
  const CheckIcon = getIconsHandler(AppIconType.CHECK);
  const { isSmScreen } = useScreenSize();
  const [isEditProfile, setEditProfile] = useState(false);
  const MoreLink = NavLink.filter((e) => !e?.showInMenu);
  const { canAccess } = useAuthorization();
  const AccessMoreLink = MoreLink?.filter((e) => {
    if (!e?.canAccessBy) {
      return true;
    }
    return canAccess(e?.canAccessBy);
  });
  const isVerified = true;

  const Profile = (
    <div className={"flex flex-col sm:py-2 py-5 items-center justify-center"}>
      <div className={"flex flex-col items-center gap-4"}>
        {userDetails?.profileImage && (
          <div
            className={
              "relative  h-20 w-20 max-h-20 max-w-20 rounded-full bg-ash-100"
            }
          >
            <ViewFile
              name={[userDetails?.profileImage]}
              className={
                "sm:max-w-20 sm:max-h-20 max-h-28 max-w-28 rounded-full object-cover"
              }
            />
            {isVerified && (
              <div
                className={
                  "absolute sm:bottom-[0px] bottom-1 right-1 bg-green-500 shadow-lg text-white rounded-full p-1 border-2 border-white"
                }
              >
                <CheckIcon className={"text-xs"} />
              </div>
            )}
          </div>
        )}
        <div className={"flex flex-col items-center"}>
          <span className={"text-xl font-medium"}>
            {userDetails?.name ?? ""}
          </span>
          <span className={"text-sm text-gray-500"}>{userDetails?.email}</span>
          <div
            onClick={() => setEditProfile(true)}
            className={
              "flex cursor-pointer items-center gap-1 text-sm text-blue-600"
            }
          >
            <EditIcon />
            <span>Edit Profile</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={"min-w-[200px]"}>
      {(!showMoreNavLink || isSmScreen) && Profile}
      <div className={"flex flex-col"}>
        <div className={"grid sm:grid-cols-3 grid-cols-1"}>
          {showMoreNavLink &&
            AccessMoreLink.map((e, key) => {
              const Icon = getIconsHandler(e?.icon);
              return (
                <RouterNavLink
                  className={
                    "flex items-center gap-2 cursor-pointer sm:p-4 p-2 hover:bg-ash-100 rounded-md"
                  }
                  key={key}
                  to={e?.path}
                >
                  <Icon className={"text-2xl"} />
                  <span className={"text-base"}>{e?.name}</span>
                </RouterNavLink>
              );
            })}
        </div>
        {(!showMoreNavLink || isSmScreen) && (
          <div
            onClick={async () => {
              await logoutHandler(userDetails?.userType);
            }}
            className={
              "flex items-center gap-2 cursor-pointer text-red-500 p-2 hover:bg-ash-100 rounded-md"
            }
          >
            <LogoutIcon className={"text-xl "} />
            <span className={""}>Logout</span>{" "}
          </div>
        )}
      </div>
      {isEditProfile && (
        <EditUserProfile onClose={() => setEditProfile(false)} />
      )}
    </div>
  );
}

export default NavProfileContent;

import React from "react";
import { NavLink, PageLinks } from "constant";
import { getIconsHandler } from "utils";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useAuthorization, useScreenSize } from "hooks";
import Logo from "assets/logo.jpg";
import { NavProfileContent } from "components";
import { Popover } from "antd";
import { AppIconType } from "interfaces";

function NavComponent() {
  const { canAccess } = useAuthorization();
  const UserIcon = getIconsHandler(AppIconType.USER);
  const navigate = useNavigate();
  const { isSmScreen } = useScreenSize();
  const AccessMenuLink = NavLink?.filter((e) => {
    if (isSmScreen && e?.hideFromMenuInSmScreen) return false;
    if (!e?.showInMenu) return false;
    if (!e?.canAccessBy) {
      return true;
    }
    return canAccess(e?.canAccessBy);
  });

  return (
    <div
      className={
        "flex sm:justify-between items-center justify-stretch sm:flex-col flex-row bg-ash-100 sm:rounded-r-lg rounded-t-lg"
      }
    >
      <div className={"sm:mt-[25px] mt-0 w-full sm:p-0 px-5"}>
        <div className={"  justify-center sm:flex hidden"}>
          <img
            src={Logo}
            className={"h-[50px] object-contain rounded-2xl"}
            alt={"logo"}
          />
        </div>
        <div
          className={
            "flex sm:flex-col flex-row items-center sm:justify-stretch justify-between gap-2 sm:mt-[25px] mt-0"
          }
        >
          {AccessMenuLink.map((e, key) => {
            const Icon = getIconsHandler(e?.icon);
            return (
              <RouterNavLink key={key} to={e?.path}>
                {({ isActive }) => {
                  return (
                    <div
                      className={`flex flex-col gap-1 items-center text-center transition-all`}
                    >
                      <div
                        className={`p-2 ${isActive ? "bg-ash-200  rounded-xl" : ""} text-gray-500`}
                      >
                        <Icon className={"text-[24px] "} />
                      </div>
                      <span
                        className={"sm:block hidden text-[12px]  text-gray-500"}
                      >
                        {e?.name}
                      </span>
                    </div>
                  );
                }}
              </RouterNavLink>
            );
          })}
          <div
            onClick={() => navigate(PageLinks.dashboard.more)}
            className={
              "bg-ash-400 text-ash-100 rounded-full p-2 cursor-pointer sm:hidden block"
            }
          >
            <UserIcon />
          </div>
        </div>
      </div>
      <div className={"pb-[24px] sm:flex hidden items-center justify-center"}>
        <Popover placement={"rightTop"} content={<NavProfileContent />}>
          <div
            className={
              "bg-ash-400 text-ash-100 rounded-full p-2 cursor-pointer"
            }
          >
            <UserIcon />
          </div>
        </Popover>
      </div>
    </div>
  );
}

export default NavComponent;

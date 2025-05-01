import React from "react";
import { getIconsHandler } from "utils";
import { AppIconType, QueryNames } from "interfaces";
import { useNavigate, useSearchParams } from "react-router-dom";

interface IProps {
  title?: any;
  breadcrumb?: { name: string; path?: string }[];
  haveActiveInactiveSwitch?: boolean;
  backLink?: string;
  titleRightChildren?: React.ReactElement;
  children: React.ReactElement;
  showNav?: boolean;
  isMobileView?: boolean;
  transparentPage?: boolean;
}
function PageTemplate({
  titleRightChildren,
  title,
  haveActiveInactiveSwitch,
  children,
  backLink,
  transparentPage,
}: IProps) {
  const navigate = useNavigate();
  const BackIcon = getIconsHandler(AppIconType.BACK);
  return (
    <div
      className={`flex flex-col h-full pt-5  px-5 gap-5 overflow-scroll hide-scrollbar ${transparentPage ? "bg-transparent" : "bg-white"} rounded-3xl`}
    >
      {(title || backLink) && (
        <div className={"flex items-center justify-between select-none"}>
          <div className={"flex items-center gap-4 "}>
            {backLink && (
              <div
                onClick={() => navigate(backLink)}
                className={" cursor-pointer hover:bg-gray-100 p-1 rounded-full"}
              >
                <BackIcon className={"text-[25px] text-black"} />
              </div>
            )}
            <span className={"font-bold text-[20px]"}>{title}</span>
          </div>
          <div className={"flex items-center gap-3 h-full"}>
            {haveActiveInactiveSwitch && <ActiveInactiveSwitchComponent />}
            {titleRightChildren}
          </div>
        </div>
      )}
      <div className={` h-full overflow-y-scroll sm:pb-0 pb-2 hide-scrollbar`}>
        {children}
      </div>
    </div>
  );
}

const ActiveInactiveSwitchComponent = () => {
  const [query, setQuery] = useSearchParams();

  const isInactive = query.get(QueryNames.INACTIVE) == "1";
  return (
    <div
      className={
        "flex items-center bg-gray-100 px-2 rounded-md cursor-pointer text-[0.9rem] h-[35px]"
      }
    >
      <div
        className={`${!isInactive ? "bg-white shadow-sm" : ""} px-2 py-1 rounded-md `}
        onClick={() => {
          query.set(QueryNames.INACTIVE, "0");
          setQuery(query);
        }}
      >
        Active
      </div>
      <div
        className={`${isInactive ? "bg-white shadow-sm" : ""} px-2 py-1 rounded-md `}
        onClick={() => {
          query.set(QueryNames.INACTIVE, "1");
          setQuery(query);
        }}
      >
        Inactive
      </div>
    </div>
  );
};

export default PageTemplate;

import React from "react";
import EmptyImage from "assets/fileSearch.svg";
import { MyButton } from "components";
import { useNavigate } from "react-router-dom";
import { AppIconType } from "interfaces";

function EmptyMessageComponent({
  message,
  navigateTo,
}: {
  message?: string;
  navigateTo?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className={"flex flex-col justify-center items-center gap-5 pt-10"}>
      <img src={EmptyImage} alt={"empty"} className={"w-[200px]"} />
      <div className={"flex flex-col gap-2 items-center"}>
        <span className={"text-gray-400 text-sm"}>
          {message || "No records found. Get started by adding a new entry."}
        </span>
        {navigateTo && (
          <MyButton
            iconType={AppIconType.ADD}
            color={"default"}
            variant={"text"}
            onClick={() => navigate(navigateTo)}
            name={"Add now"}
          />
        )}
      </div>
    </div>
  );
}

export default EmptyMessageComponent;

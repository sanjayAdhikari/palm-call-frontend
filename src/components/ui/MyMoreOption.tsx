import React from "react";
import { Dropdown } from "antd";
import { getIconsHandler } from "utils";
import { AppIconType } from "interfaces";

interface MyMoreOption {
  items: { label: string; color?: string; onClick: () => any }[];
}
function MyMoreOption({ items }: MyMoreOption) {
  const MoreIcon = getIconsHandler(AppIconType.DOTS);
  return (
    <div className={"flex items-start"}>
      <Dropdown
        menu={{
          items: items?.map((e, key) => {
            return {
              label: (
                <div
                  className={"text-primary"}
                  onClick={() =>
                    typeof e?.onClick === "function" && e?.onClick()
                  }
                >
                  {e?.label}
                </div>
              ),
              type: "item",
              key: key,
            };
          }),
        }}
        trigger={["click"]}
      >
        <div
          onClick={(e) => e?.stopPropagation()}
          className={"cursor-pointer hover:bg-gray-50 rounded-full p-2"}
        >
          <MoreIcon />
        </div>
      </Dropdown>
    </div>
  );
}

export default MyMoreOption;

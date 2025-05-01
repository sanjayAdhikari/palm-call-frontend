import { getIconsHandler } from "utils";
import { AppIconType } from "interfaces";

export const UserIconPlaceholder = () => {
  const UserIcon = getIconsHandler(AppIconType.USER);
  return (
    <div className={"bg-ash-200 rounded-full p-2 text-sm text-ash-500"}>
      <UserIcon />
    </div>
  );
};

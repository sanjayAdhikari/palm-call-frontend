import { UserIconPlaceholder } from "components";
import { IUser } from "interfaces";
import React, { useState } from "react";
import { usePresence } from "../../socket/usePresence";
import ViewFile from "./ViewFile";

export default function UserProfileCard({
  user,
  profile,
  title,
  hideProfile,
  textClassName,
}: {
  user: IUser;
  profile?: string;
  rating?: number;
  textClassName?: string;
  hideProfile?: boolean;
  title?: string;
  allowMultiLine?: boolean;
}) {
  const [errorOnLoadingImage, setErrorLoadingImage] = useState(false);

  const fullName = user?.name.trim();
  const isOnline = usePresence(user?._id);

  return (
    <div className=" flex items-center space-x-3">
      {!profile || errorOnLoadingImage ? (
        <UserIconPlaceholder />
      ) : (
        <ViewFile
          canPreview={false}
          name={[profile]}
          className={"max-h-8 max-w-8 rounded-full"}
          onError={(val) => setErrorLoadingImage(val)}
        />
      )}
      <div className={"flex flex-row items-center gap-2"}>
        <span
          className={`h-2 w-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-400"
          }`}
        ></span>
        <span className={`text-base font-medium ${textClassName}`}>
          {fullName}
        </span>
      </div>
    </div>
  );
}

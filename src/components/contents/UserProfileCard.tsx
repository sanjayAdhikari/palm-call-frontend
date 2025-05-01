import { useState, useEffect } from "react";
import { Rate } from "antd";
import { UserIconPlaceholder } from "components";
import ViewFile from "./ViewFile";

export default function UserProfileCard({
  name,
  profile,
  title,
  hideProfile,
  textClassName,
}: {
  name: string;
  profile?: string;
  rating?: number;
  textClassName?: string;
  hideProfile?: boolean;
  title?: string;
  allowMultiLine?: boolean;
}) {
  const [errorOnLoadingImage, setErrorLoadingImage] = useState(false);

  const fullName = name.trim();

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
      <div className={"flex flex-col"}>
        <span className={`text-base font-medium ${textClassName}`}>
          {fullName}
        </span>
        {title && <span className={"text-xs text-ash-500"}>{title}</span>}
      </div>
    </div>
  );
}

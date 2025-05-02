import { UserIconPlaceholder, ViewFile } from "components";
import { IUser } from "interfaces";
import React from "react";
import { usePresence } from "../../../socket/usePresence";

interface ChatHeaderProps {
  participant: IUser;
  isTyping: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ participant, isTyping }) => {
  const isOnline = usePresence(participant?._id);
  return (
    <div className="flex items-center gap-3">
      {participant?.profileImage ? (
        <ViewFile
          canPreview={false}
          name={[participant?.profileImage]}
          className={
            "sm:max-w-8 sm:max-h-8 max-h-8 max-w-8 rounded-full object-cover"
          }
        />
      ) : (
        <UserIconPlaceholder />
      )}
      <div>
        <div className="font-medium text-sm flex items-center gap-2">
          {participant.name}
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-400"
            }`}
          ></span>
        </div>
        {isTyping && (
          <div className="text-xs text-gray-500 animate-pulse">Typing...</div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

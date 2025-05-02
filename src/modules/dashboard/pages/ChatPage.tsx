import { MyButton, MyMoreOption, PageTemplate } from "components";
import { PageLinks } from "constant";
import { useAuthorization, useScreenSize } from "hooks";
import {
  AppIconType,
  IUser,
  QueryNames,
  SocketEventEnum,
  SupportChatStatusEnum,
  UserType,
} from "interfaces";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getSocket,
  joinThread,
  leaveThread,
} from "../../../socket/socketClient";
import { ChatBox } from "../components";
import ChatHeader from "../components/ChatHeader";
import { ChatContext } from "../context";

function SupportChatPage() {
  const [query] = useSearchParams();
  const { getDetailsHandler, isDetailsLoading, details, toggleVisibility } =
    useContext(ChatContext);
  const { currentRole, currentUserId } = useAuthorization();
  const isSmScreen = useScreenSize().isSmScreen;
  const activityId = query.get(QueryNames.ID);
  const isUser = currentRole === UserType.USER;

  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const fetchThread = async () => {
    await getDetailsHandler(activityId);
  };
  useEffect(() => {
    if (!details?._id) return;
    joinThread(details._id);

    return () => {
      leaveThread(details._id);
    };
  }, [details?._id]);

  useEffect(() => {
    if (activityId) fetchThread();
  }, [activityId]);

  const otherParticipant: IUser | undefined = details?.participants?.find(
    (each) => each._id !== currentUserId,
  );
  const Name = otherParticipant?.name || "Unknown";

  // 👇 Handle typing state from other participant
  useEffect(() => {
    if (!details?._id || !otherParticipant?._id) return;
    const socket = getSocket();

    const handleStart = ({ from }: { from: string }) => {
      if (from === otherParticipant._id) setIsOtherTyping(true);
    };

    const handleStop = ({ from }: { from: string }) => {
      if (from === otherParticipant._id) setIsOtherTyping(false);
    };

    socket.on(SocketEventEnum.START_TYPING, handleStart);
    socket.on(SocketEventEnum.STOP_TYPING, handleStop);

    return () => {
      socket.off(SocketEventEnum.START_TYPING, handleStart);
      socket.off(SocketEventEnum.STOP_TYPING, handleStop);
    };
  }, [details?._id, otherParticipant?._id]);

  return (
    <PageTemplate
      backLink={isSmScreen && PageLinks.dashboard.chat}
      title={
        otherParticipant ? (
          <ChatHeader participant={otherParticipant} isTyping={isOtherTyping} />
        ) : (
          <></>
        )
      }
      titleRightChildren={
        <div className="flex items-center gap-2">
          <div className="flex items-center ">
            <MyButton iconType={AppIconType.AUDIO_CALL} variant="text" />
            <MyButton iconType={AppIconType.VIDEO_CALL} variant="text" />
          </div>
          <MyMoreOption
            items={[SupportChatStatusEnum.COMPLETED].map((status) => ({
              label: status,
              onClick: async () => {
                await toggleVisibility(details._id, status, {
                  onSuccess: fetchThread,
                });
              },
            }))}
          />
        </div>
      }
    >
      <div className="flex flex-col flex-1 overflow-hidden h-full w-full">
        {isDetailsLoading ? (
          <div className="text-center pt-2">Loading...</div>
        ) : !details ? (
          <div className="text-center pt-2">Something went wrong.</div>
        ) : (
          <ChatBox thread={details} />
        )}
      </div>
    </PageTemplate>
  );
}

export default SupportChatPage;

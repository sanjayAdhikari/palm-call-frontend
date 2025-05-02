import { MyButton } from "components";
import { AppIconType, IUser, SupportChatStatusEnum } from "interfaces";
import React from "react";
import { MyMoreOption } from "../../../components/ui";
import { useCall } from "../../../webRTC/useCall";

const ChatMoreOptions = ({ participant }: { participant: IUser }) => {
  const { startCall } = useCall();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center ">
        <MyButton
          iconType={AppIconType.AUDIO_CALL}
          variant="text"
          onClick={() => {
            startCall(participant._id?.toString(), "audio");
          }}
        />
        <MyButton
          iconType={AppIconType.VIDEO_CALL}
          variant="text"
          onClick={() => {
            startCall(participant._id?.toString(), "video");
          }}
        />
      </div>
      <MyMoreOption
        items={[SupportChatStatusEnum.COMPLETED].map((status) => ({
          label: status,
          onClick: async () => {
            // await toggleVisibility(details._id, status, {
            //   onSuccess: fetchThread,
            // });
          },
        }))}
      />
    </div>
  );
};

export default ChatMoreOptions;

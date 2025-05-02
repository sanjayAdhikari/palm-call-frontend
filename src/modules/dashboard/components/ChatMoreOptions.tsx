import { MyButton, MyMoreOption } from "components";
import { AppIconType, IUser, SupportChatStatusEnum } from "interfaces";
import { useCall } from "../../../webRTC/useCall";

const ChatMoreOptions = ({ participant }: { participant: IUser }) => {
  const { startCall } = useCall();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <MyButton
          iconType={AppIconType.AUDIO_CALL}
          variant="text"
          onClick={() =>
            startCall(participant._id.toString(), "audio", participant)
          }
        />
        <MyButton
          iconType={AppIconType.VIDEO_CALL}
          variant="text"
          onClick={() =>
            startCall(participant._id.toString(), "video", participant)
          }
        />
      </div>
      <MyMoreOption
        items={[SupportChatStatusEnum.COMPLETED].map((status) => ({
          label: status,
          onClick: async () => {
            // Your toggleVisibility logic here
          },
        }))}
      />
    </div>
  );
};

export default ChatMoreOptions;

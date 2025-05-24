import { MyButton } from "components";
import { AppIconType, IUser } from "interfaces";
import { useCall } from "../../../webRTC/useCall";

const ChatMoreOptions = ({ participant }: { participant: IUser }) => {

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <MyButton
          iconType={AppIconType.AUDIO_CALL}
          variant="text"
        />
        <MyButton
          iconType={AppIconType.VIDEO_CALL}
          variant="text"

        />
      </div>
    </div>
  );
};

export default ChatMoreOptions;

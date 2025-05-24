import { MyButton } from "components";
import { AppIconType } from "interfaces";
import { useRef } from "react";
import { getAccessToken } from "utils";
import { initSocket } from "../../socket/socketClient";
import Emitter from "../../webRTC/Emitter";

const GlobalAudioCall = () => {
  const socketRef = useRef(initSocket(getAccessToken()));
  const handleClick = () => {
    const meetingID = "global-room-abc123"; // dynamic later
    Emitter.emit("call:start", {
      meetingID,
      type: "audio",
      callerInfo: {
        name: "Sanjay Adhikari",
        profileImage: "",
      },
      initiatorId: socketRef.current.id, // 👈 pass socket ID
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <MyButton
          iconType={AppIconType.AUDIO_CALL}
          variant="text"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default GlobalAudioCall;

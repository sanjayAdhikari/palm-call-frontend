import { Modal } from "antd";
import { MyButton, ViewFile } from "components";
import React from "react";
import { useCall } from "./useCall";

const CallModal: React.FC = () => {
  const { isReceiving, callType, callerInfo, acceptCall, rejectCall } =
    useCall();
  if (!isReceiving) return null;

  return (
    <Modal open={isReceiving} centered footer={null} closable={false}>
      <div className="text-center">
        {callType === "audio" && callerInfo?.profileImage && (
          <ViewFile
            name={[callerInfo.profileImage]}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
        )}

        <p className="mb-2 font-medium">
          Incoming {callType} call from{" "}
          <strong>{callerInfo?.name ?? "Unknown"}</strong>
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <MyButton color="green" onClick={acceptCall}>
            Accept
          </MyButton>
          <MyButton color="danger" onClick={rejectCall}>
            Reject
          </MyButton>
        </div>
      </div>
    </Modal>
  );
};

export default CallModal;

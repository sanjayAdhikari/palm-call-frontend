import { ViewFile } from "components";
import { useCall } from "./useCall";

const CallModal = () => {
  const { isReceiving, incomingCall, callerInfo, acceptCall, rejectCall } =
    useCall();

  if (!isReceiving || !incomingCall) return null;

  const { type } = incomingCall;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[320px] text-center shadow-xl">
        {type === "audio" && callerInfo?.profileImage && (
          <ViewFile
            name={[callerInfo.profileImage]}
            canPreview={false}
            className="w-16 h-16 mx-auto rounded-full object-cover mb-3"
          />
        )}

        <p className="mb-2 text-lg font-semibold">
          Incoming {type} call from{" "}
          <span className="text-blue-600">{callerInfo?.name ?? "Someone"}</span>
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={acceptCall}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={rejectCall}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;

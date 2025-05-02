import { ApiUrl } from "constant";
import { useAppContext } from "context";
import { useContextData } from "hooks";
import {
  ICallbackFunction,
  IContext,
  IPaginateData,
  ISupportChat,
  ISupportThread,
} from "interfaces";
import { createContext } from "react";

export const ChatContext = createContext<
  IContext<IPaginateData<ISupportThread>, ISupportThread>
>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,
  currentPage: 1,
  async editHandler(payload, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
  async deleteHandler(id, cb) {},
});

export default function ContextProvider({ children }) {
  const {
    isLoading,
    isDetailsLoading,
    getDetailsHandler,
    details,
    getListHandler,
    lists,
    setDetails,
    saveHandler,
    deleteHandler,
    editHandler,
    currentPage,
  } = useContextData();
  const { userDetails } = useAppContext();

  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.support.get_threadList, query);
    },

    async getDetailsHandler(threadID: string) {
      return getDetailsHandler(ApiUrl.support.get_threadDetail(threadID));
    },

    async editHandler(payload: any, cb: ICallbackFunction) {
      return saveHandler(
        ApiUrl.support.post_sendMessage,
        payload,
        {
          onSuccess: async (res: any) => {
            // const tempDetails: ISupportChat = { ...details };
            // res.sender = userDetails;
            // tempDetails.messages.docs.push(res);
            // setDetails(tempDetails);
            typeof cb?.onSuccess === "function" && (await cb.onSuccess(res));
          },
        },
        {
          hideMessage: true,
        },
      );
    },

    async deleteHandler(id: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.support.delete_thread(id), {
        onSuccess: async (res: any) => {
          const tempDetails: ISupportChat = { ...details };
          tempDetails.messages.docs = tempDetails.messages.docs.filter(
            (e) => e?._id !== id,
          );
          // .reverse();
          setDetails(tempDetails);
          typeof cb?.onSuccess === "function" && (await cb.onSuccess(res));
        },
      });
    },
  };
  return (
    <ChatContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        currentPage,
        ...Handlers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

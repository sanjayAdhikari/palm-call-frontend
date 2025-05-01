import { createContext } from "react";
import {
  ICallbackFunction,
  IContext,
  INotification,
  IPaginateData,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

interface INotificationContext
  extends IContext<IPaginateData<INotification>, INotification> {
  seenNotification(
    id: string,
    status: "on" | "off",
    cb: ICallbackFunction,
  ): Promise<void>;
}
export const NotificationContext = createContext<INotificationContext>({
  isLoading: false,
  lists: undefined,
  details: undefined,
  isDetailsLoading: false,
  async seenNotification(payload, status, cb) {},
  async getDetailsHandler(id) {},
  async getListHandler(query) {},
});

export default function ContextProvider({ children }) {
  const {
    isLoading,
    isDetailsLoading,
    getDetailsHandler,
    details,
    getListHandler,
    lists,
    editHandler,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: any) {
      return getListHandler(ApiUrl.notifications.get_list, query);
    },
    async getDetailsHandler(id: string) {
      return getDetailsHandler(ApiUrl.notifications.get_details(id));
    },
    async seenNotification(
      id: string,
      status: "on" | "off",
      cb: ICallbackFunction,
    ) {
      return editHandler(ApiUrl.notifications.put_toggle(id, status), {}, cb);
    },
  };
  return (
    <NotificationContext.Provider
      value={{
        isDetailsLoading,
        isLoading,
        lists,
        details,
        ...Handlers,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

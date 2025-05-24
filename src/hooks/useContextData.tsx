import { PAGE_SIZE } from "constant";
import { useAppContext } from "context";
import { ICallbackFunction, IGetApiQuery } from "interfaces";
import { useState } from "react";
import { Api } from "services";

function UseContextData() {
  const {
    handler: { setError, setLoading: setAppLoading, setSuccess },
  } = useAppContext();
  const [isLoading, setLoading] = useState(false);
  const [isDetailsLoading, setDetailsLoading] = useState(false);
  const [lists, setLists] = useState<any>(undefined);
  const [details, setDetails] = useState<any>(undefined);

  const [currentPage, setCurrentPage] = useState(1);

  const { getApi, putApi, deleteApi, postApi } = Api();
  const getErroMessage = (err?: any): string => {
    let message = err?.message;
    if (err?.data?.length > 0) {
      message = err?.data?.join(", ");
    }
    return message;
  };
  const Handlers = {
    async getListHandler(url: string, query?: IGetApiQuery) {
      const hideLoading = query?.savePrevState;
      try {
        !hideLoading && setLoading(true);
        const res = await getApi(url, {
          ...query,
          ...(query?.havePagination
            ? {
                pageSize: query?.pageSize || PAGE_SIZE,
                page: query?.page || 1,
              }
            : {}),
        });

        setCurrentPage((e) => query?.page || 1);
        setLists((e) => {
          if (!e || !query?.savePrevState) {
            return res?.data;
          } else {
            e?.docs?.push(...res?.data?.docs);
            return e;
          }
        });
      } catch (err) {
        setError(getErroMessage(err));
      } finally {
        setLoading(false);
      }
    },
    async getDetailsHandler(url: string, query?: any) {
      try {
        setDetailsLoading(true);
        setDetails(undefined);
        const res = await getApi(url, query);
        setDetails(res?.data);
      } catch (err) {
        setError(getErroMessage(err));
      } finally {
        setDetailsLoading(false);
      }
    },
    async toggleVisibilityHandler(url: string, cb?: ICallbackFunction) {
      try {
        setAppLoading(true);
        const res = await putApi(url);
        if (typeof cb?.onSuccess === "function") {
          await cb.onSuccess(res?.data);
        }
      } catch (err) {
        setError(getErroMessage(err));

        if (typeof cb?.onError === "function") {
          await cb.onError(err);
        }
      } finally {
        setAppLoading(false);
      }
    },
    async deleteHandler(url: string, cb?: ICallbackFunction) {
      try {
        setAppLoading(true);
        const res = await deleteApi(url);
        setSuccess("Deleted successfully");
        if (typeof cb?.onSuccess === "function") {
          await cb.onSuccess(res?.data);
        }
      } catch (err) {
        setError(getErroMessage(err));

        if (typeof cb?.onError === "function") {
          await cb.onError(err);
        }
      } finally {
        setAppLoading(false);
      }
    },
    async editHandler(url: string, payload: any, cb?: ICallbackFunction) {
      try {
        setAppLoading(true);
        const res = await putApi(url, payload);
        setSuccess("Update successfully");

        if (typeof cb?.onSuccess === "function") {
          await cb?.onSuccess(res?.data);
        }
      } catch (err) {
        setError(getErroMessage(err));

        if (typeof cb?.onError === "function") {
          await cb.onError(err);
        }
      } finally {
        setAppLoading(false);
      }
    },
    async saveHandler(
      url: string,
      payload: any,
      cb?: ICallbackFunction,
      config?: {
        hideMessage?: boolean;
        hideLoading?: boolean;
      },
    ) {
      try {
        !config?.hideLoading && setAppLoading(true);
        const res = await postApi(url, payload);
        !config?.hideMessage && setSuccess("Created successfully");
        if (typeof cb?.onSuccess === "function") {
          await cb.onSuccess(res?.data);
        }
      } catch (err) {
        !config?.hideMessage && setError(getErroMessage(err));
        if (typeof cb?.onError === "function") {
          await cb.onError(err);
        }
      } finally {
        !config?.hideLoading && setAppLoading(false);
      }
    },
  };

  return {
    isLoading,
    isDetailsLoading,
    lists,
    details,
    setDetails,
    setLists,
    currentPage,
    ...Handlers,
  };
}

export default UseContextData;

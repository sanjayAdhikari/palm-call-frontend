import { createContext } from "react";
import {
  ICallbackFunction,
  IContext,
  IGetApiQuery,
  IPaginateData,
  IRating,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

interface IRatingContext extends IContext<IPaginateData<IRating>, IRating> {
  givenRating: IPaginateData<IRating>;
  isGivenRatingLoading: boolean;
  givenRatingCurrentPage: number;
  getGivenRatingHandler: (query: IGetApiQuery) => Promise<void>;

  averageRating: {
    average: number;
    total: number;
  };
  isAverageRatingLoading: boolean;
  getAverageRatingHandler: (query: any) => Promise<void>;
}
export const RatingContext = createContext<IRatingContext>({
  isLoading: false,
  givenRating: undefined,
  currentPage: 1,
  givenRatingCurrentPage: 1,
  isGivenRatingLoading: false,
  lists: undefined,

  averageRating: undefined,
  isAverageRatingLoading: false,
  getAverageRatingHandler: async (query: any) => {},

  async getGivenRatingHandler(query) {},
  async getListHandler(query) {},

  async editHandler(payload, cb) {},
  async deleteHandler(id, cb) {},
});

export default function ContextProvider({ children }) {
  const {
    isLoading,
    isDetailsLoading: isAverageRatingLoading,
    details: averageRating,
    getDetailsHandler: getAverageRatingHandler,
    getListHandler,
    lists,
    saveHandler,
    currentPage,
    deleteHandler,
  } = useContextData();
  const {
    isLoading: isGivenRatingLoading,
    getListHandler: getGivenRatingHandler,
    lists: givenRating,
    currentPage: givenRatingCurrentPage,
  } = useContextData();
  const Handlers = {
    async getListHandler(query: IGetApiQuery) {
      return getListHandler(ApiUrl.rating.get_received, query);
    },
    async getAverageRatingHandler(query: any) {
      return getAverageRatingHandler(ApiUrl.rating.get_averageRating, query);
    },
    async getGivenRatingHandler(query: IGetApiQuery) {
      return getGivenRatingHandler(ApiUrl.rating.get_given, query);
    },
    async editHandler(payload: any, cb: ICallbackFunction) {
      return saveHandler(ApiUrl.rating.post_save, payload, cb);
    },
    async deleteHandler(id: string, cb: ICallbackFunction) {
      return deleteHandler(ApiUrl.rating.delete_remove(id), cb);
    },
  };
  return (
    <RatingContext.Provider
      value={{
        currentPage,
        givenRatingCurrentPage,
        isGivenRatingLoading,
        givenRating,
        isAverageRatingLoading,
        isLoading,
        lists,
        averageRating,
        ...Handlers,
      }}
    >
      {children}
    </RatingContext.Provider>
  );
}

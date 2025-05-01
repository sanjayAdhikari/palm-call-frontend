import { createContext } from "react";
import {
  ICallbackFunction,
  IPaginateData,
  ITransaction,
  IWallet,
  LoadWalletServiceProvider,
  PaymentThrough,
} from "interfaces";
import { useContextData } from "hooks";
import { ApiUrl } from "constant";

interface IWalletContext {
  isMyWalletLoading: boolean;
  isTransactionLoading: boolean;
  myWallet: IWallet;
  transactions: IPaginateData<ITransaction>;

  getMyWalletHandler(): Promise<void>;
  getTransactionsHandler(query?: any): Promise<void>;
  makeActivityPaymentHandler(
    payload: {
      activityId: string;
      paymentThrough: PaymentThrough;
    },
    cb: ICallbackFunction,
  ): Promise<void>;
  loadPaymentHandler(
    payload: {
      amount?: number;
      activityId?: string;
      serviceProvider?: LoadWalletServiceProvider;
    },
    cb: ICallbackFunction,
  ): Promise<void>;
}
export const WalletContext = createContext<IWalletContext>({
  isMyWalletLoading: false,
  isTransactionLoading: false,
  myWallet: undefined,
  transactions: undefined,
  async loadPaymentHandler(payload, cb) {},
  async getTransactionsHandler() {},
  async getMyWalletHandler() {},
  async makeActivityPaymentHandler(payload, cb) {},
});

export default function ContextProvider({ children }) {
  const {
    isLoading: isTransactionLoading,
    lists: transactions,
    isDetailsLoading: isMyWalletLoading,
    details: myWallet,
    getDetailsHandler: getMyWalletHandler,
    getListHandler: getTransactionsHandler,
    saveHandler: loadPaymentHandler,
    editHandler: makeWalletPaymentHandler,
  } = useContextData();
  const onSuccessInitiateLoadPayment = (esewaUrl: string, params: any) => {
    try {
      const form = document.createElement("form");
      form.action = esewaUrl;
      form.method = "POST";

      Object.keys(params || {}).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.log(err);
    }
  };

  const Handlers = {
    async loadPaymentHandler(
      payload: {
        amount?: number;
        activityId?: string;
        serviceProvider: LoadWalletServiceProvider;
      },
      cb: ICallbackFunction,
    ) {
      let url: string;
      if (payload?.serviceProvider === LoadWalletServiceProvider.ESEWA) {
        url = ApiUrl.wallet.post_esewaInitial;
      }

      return loadPaymentHandler(
        url,
        payload,
        {
          onSuccess: async (res: any) => {
            onSuccessInitiateLoadPayment(res?.esewaUrl, res?.params);
          },
          onError: async (error) => {},
        },
        {
          hideMessage: true,
        },
      );
    },
    async makeActivityPaymentHandler(
      payload: {
        activityId: string;
        paymentThrough: PaymentThrough;
      },
      cb: ICallbackFunction,
    ) {
      switch (payload?.paymentThrough) {
        case PaymentThrough.ESEWA:
          return Handlers?.loadPaymentHandler(
            {
              activityId: payload?.activityId,
              serviceProvider: LoadWalletServiceProvider.ESEWA,
            },
            {
              onError: async (error) => {
                await cb?.onError(error);
              },
              onSuccess: async (res) => {
                await Promise.all([
                  Handlers?.getMyWalletHandler(),
                  cb?.onSuccess(res),
                ]);
              },
            },
          );
        case PaymentThrough.HYRE_WALLET:
          return makeWalletPaymentHandler(
            ApiUrl.wallet.put_payThroughWallet(payload?.activityId),
            {},
            cb,
          );
        default:
          return;
      }
    },

    async getTransactionsHandler(query?: any) {
      return getTransactionsHandler(ApiUrl.wallet.get_transaction, query);
    },
    async getMyWalletHandler() {
      return getMyWalletHandler(ApiUrl.wallet.get_my);
    },
  };
  return (
    <WalletContext.Provider
      value={{
        isTransactionLoading,
        isMyWalletLoading,
        myWallet,
        transactions,
        ...Handlers,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

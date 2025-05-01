import React, { useContext, useState } from "react";
import { MyButton, MyFormSubmitButton, MyInput, MyModal } from "components";
import { AppIconType, LoadWalletServiceProvider } from "interfaces";
import { Form, Formik } from "formik";
import { WalletContext } from "context";
import * as yup from "yup";
import { getIconsHandler } from "utils";
import EsewaIcon from "assets/esewa.png";

function LoadBalanceComponent() {
  const [isOpen, setOpen] = useState(false);
  const { loadPaymentHandler } = useContext(WalletContext);
  const CheckIcon = getIconsHandler(AppIconType.RADIO_ON);
  const onSubmitHandler = async (values: any) => {
    await loadPaymentHandler(values, {
      onSuccess: async () => {
        setOpen(false);
      },
      onError: async () => {
        setOpen(false);
      },
    });
  };
  return (
    <>
      <MyButton
        onClick={() => setOpen(true)}
        iconType={AppIconType.ADD}
        name={"Load Wallet"}
      />
      {isOpen && (
        <MyModal title={""} onCancel={() => setOpen(false)}>
          <Formik
            initialValues={{
              amount: "",
              serviceProvider: LoadWalletServiceProvider.ESEWA,
            }}
            validationSchema={yup.object().shape({
              amount: yup.number().min(10, " ").required(" "),
              serviceProvider: yup.string().required(" "),
            })}
            onSubmit={onSubmitHandler}
          >
            <Form className={"flex flex-col gap-5"}>
              {/* Amount Section */}
              <span className={"text-xl font-bold"}>Load Wallet</span>
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Amount
                </h2>
                <MyInput
                  name={"amount"}
                  inputType={"number"}
                  placeholder={"00.00"}
                />
                <div className={"text-gray-500 text-xs pt-1"}>
                  Amount should not be less than Rs.10
                </div>
              </div>

              {/* Payment Method Section */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Load via
                </h3>
                <div className="flex items-center gap-4 p-3 border-blue-500 border  rounded-md">
                  <div>
                    <CheckIcon className={"text-lg text-blue-500"} />
                  </div>
                  <div className={"flex items-center gap-2"}>
                    <img
                      className={"w-10 rounded-full shadow-sm"}
                      alt={"esewa"}
                      src={EsewaIcon}
                    />
                    <div className="text-md font-medium text-black">
                      eSewa - Mobile Wallet
                    </div>
                  </div>
                </div>
              </div>
              <MyButton name={"Confirm"} htmlType={"submit"} />
            </Form>
          </Formik>
        </MyModal>
      )}
    </>
  );
}

export default LoadBalanceComponent;

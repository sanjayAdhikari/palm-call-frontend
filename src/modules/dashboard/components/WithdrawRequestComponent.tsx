import React, { useContext, useEffect, useState } from "react";
import {
  MyButton,
  MyFormSubmitButton,
  MyInput,
  MyModal,
  Wallet,
} from "components";
import { AppIconType, IWithdrawAccount, WithdrawMethodEnum } from "interfaces";
import { Form, Formik } from "formik";
import { WalletContext, WithdrawContext } from "context";
import * as yup from "yup";
import { Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "constant";

function WithdrawRequestComponent() {
  const [isOpen, setOpen] = useState(false);
  const {
    getWithdrawAccountHandler,
    isWithdrawAccountLoading,
    withdrawAccount,
    editHandler,
  } = useContext(WithdrawContext);
  const { getMyWalletHandler, myWallet } = useContext(WalletContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!isOpen) return;
      await getWithdrawAccountHandler();
    })();
  }, [isOpen]);
  const onSubmitHandler = async (values: any) => {
    await editHandler(values, {
      onSuccess: async () => {
        await getMyWalletHandler();
        setOpen(false);
      },
    });
  };
  return (
    <>
      <MyButton
        variant={"outlined"}
        onClick={() => setOpen(true)}
        iconType={AppIconType.WITHDRAW}
        name={"Withdraw Request"}
      />
      {isOpen && (
        <MyModal title={"Withdraw Request"} onCancel={() => setOpen(false)}>
          {isWithdrawAccountLoading ? (
            <div className={"text-center"}>Loading...</div>
          ) : withdrawAccount?.hasPendingRequest ? (
            <div className={"flex flex-col gap-2"}>
              <Alert
                showIcon
                type={"info"}
                message={
                  "Your withdrawal request is currently under review. Please wait for admin approval before making another request."
                }
              />
              <MyButton
                onClick={() => navigate(PageLinks.wallet.withdrawRequest)}
                color={"default"}
                variant={"outlined"}
                block
                name={"View withdraw requests"}
              />
            </div>
          ) : (
            <Formik
              enableReinitialize
              initialValues={WithdrawFormik.initialValues(withdrawAccount)}
              validationSchema={WithdrawFormik.validationSchema(
                myWallet?.availableBalance,
              )}
              onSubmit={onSubmitHandler}
            >
              {({ values }) => {
                return (
                  <Form className={"flex flex-col gap-4 mt-2"}>
                    <Wallet type={"summery"} wallet={myWallet} />
                    <div className={"flex flex-col gap-3"}>
                      <MyInput
                        name={"requestedAmount"}
                        placeholder={"Eg: 100"}
                        inputType={"number"}
                        label={"Amount"}
                      />
                      <MyInput
                        placeholder={"Enter remarks"}
                        name={"customerReason"}
                        inputType={"text-area"}
                        label={"Remarks"}
                      />
                    </div>

                    <div className={"flex flex-col gap-2 mt-2"}>
                      <span className={"font-bold"}>Account details</span>
                      <div className={"flex flex-col gap-4"}>
                        <MyInput
                          isRequired
                          options={[
                            {
                              label: "Esewa",
                              value: WithdrawMethodEnum.ESEWA,
                            },
                            {
                              label: "Khalti",
                              value: WithdrawMethodEnum.KHALTI,
                            },
                            {
                              label: "Bank",
                              value: WithdrawMethodEnum.BANK,
                            },
                          ]}
                          name={"withdrawnTo.method"}
                          inputType={"select"}
                          label={"Method"}
                          placeholder={"Select method"}
                        />
                        {(values?.withdrawnTo?.method ===
                          WithdrawMethodEnum.ESEWA ||
                          values?.withdrawnTo?.method ===
                            WithdrawMethodEnum.KHALTI) && (
                          <MyInput
                            name={"withdrawnTo.mobileNumber"}
                            isRequired
                            placeholder={"Enter phone number"}
                            label={"Phone Number"}
                          />
                        )}
                        {values?.withdrawnTo?.method ===
                          WithdrawMethodEnum.BANK && (
                          <>
                            <MyInput
                              label={"Bank Name"}
                              isRequired
                              placeholder={"Enter bank name"}
                              name={"withdrawnTo.bankName"}
                            />
                            <div className={"grid grid-cols-2 gap-4"}>
                              <MyInput
                                isRequired
                                placeholder={"Enter account name"}
                                name={"withdrawnTo.bankAccountName"}
                                label={"A/C Name"}
                              />
                              <MyInput
                                isRequired
                                placeholder={"Enter account number"}
                                name={"withdrawnTo.bankAccountNumber"}
                                label={"A/C Number"}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <MyFormSubmitButton label={"Confirm"} />
                  </Form>
                );
              }}
            </Formik>
          )}
        </MyModal>
      )}
    </>
  );
}

const WithdrawFormik = {
  initialValues: (withdrawAccount?: IWithdrawAccount) => {
    return {
      requestedAmount: "",
      customerReason: "",
      withdrawnTo: {
        method: withdrawAccount?.method,
        bankAccountName: withdrawAccount?.bankAccountName,
        bankAccountNumber: withdrawAccount?.bankAccountNumber,
        bankName: withdrawAccount?.bankName,
        qrImage: withdrawAccount?.qrImage,
        mobileNumber: withdrawAccount?.mobileNumber,
      },
    };
  },
  validationSchema: (maxRequestAmount: number) =>
    yup.object().shape({
      requestedAmount: yup
        .number()
        .min(10, "Withdraw amount must be greater than Rs. 10")
        .max(maxRequestAmount, "Insufficient balance")
        .required(" "),
      withdrawnTo: yup.object().shape({
        method: yup.string().required(" "),
        mobileNumber: yup.string().when((values, schema, options) => {
          if (
            options?.parent?.method === WithdrawMethodEnum.ESEWA ||
            options?.parent?.method === WithdrawMethodEnum.KHALTI
          ) {
            return schema?.required(" ");
          }
          return schema;
        }),
        bankAccountName: yup.string().when((values, schema, options) => {
          if (options?.parent?.method === WithdrawMethodEnum.BANK) {
            return schema?.required(" ");
          }
          return schema;
        }),
        bankAccountNumber: yup.string().when((values, schema, options) => {
          if (options?.parent?.method === WithdrawMethodEnum.BANK) {
            return schema?.required(" ");
          }
          return schema;
        }),
        bankName: yup.string().when((values, schema, options) => {
          if (options?.parent?.method === WithdrawMethodEnum.BANK) {
            return schema?.required(" ");
          }
          return schema;
        }),
      }),
    }),
};
export default WithdrawRequestComponent;

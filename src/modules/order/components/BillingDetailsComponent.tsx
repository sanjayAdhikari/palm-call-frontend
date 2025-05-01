import React, { useContext, useState } from "react";
import { Alert, Popover } from "antd";
import { MyButton, MyFile, MyInput, MyModal, ViewFile } from "components";
import {
  AppIconType,
  CouponDiscountTypeEnum,
  IFreightCharge,
  IOrder,
  IPackageCharge,
  PaymentThrough,
  UserType,
} from "interfaces";
import { useAuthorization } from "hooks";
import { Form, Formik } from "formik";
import { capitalizeFirstLetter, commaSeparator, getIconsHandler } from "utils";
import { CanPay, getEditableFields } from "../helpers";
import { WalletContext, OrderContext } from "context";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "constant";
import Esewa from "assets/esewa.png";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";

export const BillingAmountDetails = ({
  additionalCharge,
  charge,
}: {
  additionalCharge: IPackageCharge[];
  charge: Partial<IFreightCharge>;
}) => {
  const AmountDetails = (() => {
    let subTotal = charge?.baseCharge + charge?.freightCharge;
    additionalCharge?.forEach((e) => {
      subTotal += e?.amount;
    });
    const discountValue = charge?.appliedCouponId?.discount;
    const discountType = charge?.appliedCouponId?.discountType;

    const discountAmount =
      discountType === CouponDiscountTypeEnum.PERCENTAGE
        ? subTotal * (discountValue / 100)
        : discountValue || 0;

    return {
      discountAmount: discountAmount || 0,
      subTotal: subTotal || 0,
    };
  })();

  const chargesObject = Object.fromEntries(
    (additionalCharge || [])
      ?.filter((e) => e?.amount)
      .map((e) => [
        e?.title,
        <span className={"text-right"}>Rs. {commaSeparator(e?.amount)}</span>,
      ]),
  );

  const BillDetails = {
    "Handling Charge": (
      <span className={"text-right"}>
        Rs. {commaSeparator(charge?.baseCharge) || 0.0}
      </span>
    ),
    "Freight Charge": (
      <span className={"text-right"}>
        Rs. {commaSeparator(charge?.freightCharge) || 0.0}
      </span>
    ),
    ...chargesObject,
  };

  return (
    <div className={"flex flex-col gap-1 text-sm text-gray-500"}>
      {Object.keys(BillDetails)?.map((e) => {
        return (
          <div key={e} className={"grid grid-cols-[auto_100px]"}>
            <span className={""}>{e}</span>
            {BillDetails?.[e]}
          </div>
        );
      })}
      <div
        className={
          "grid grid-cols-[auto_100px] border-t border-dashed pt-1 text-gray-500"
        }
      >
        <span>Subtotal</span>
        <span className={"text-right"}>
          Rs. {commaSeparator(AmountDetails?.subTotal)}
        </span>
      </div>{" "}
      <div className={"grid grid-cols-[auto_100px]"}>
        <span className={""}>Discount</span>
        <span className={"text-right"}>
          - Rs. {commaSeparator(AmountDetails?.discountAmount)}
        </span>
      </div>
      <div
        className={
          "grid grid-cols-[auto_100px] border-t-4 border-double pt-1 text-black text-sm"
        }
      >
        <span className={""}>Net Amount</span>
        <span className={"text-right"}>
          Rs. {commaSeparator(charge?.orderAmount || 0)}
        </span>
      </div>
    </div>
  );
};

function BillingDetailsComponent({
  details,
  id,
}: {
  details: IOrder;
  id: string;
}) {
  const { currentRole } = useAuthorization();
  const isUser = currentRole === UserType.USER;
  const { canAcceptCashPayment } = getEditableFields(details?.status);
  const CheckIcon = getIconsHandler(AppIconType.CHECK_CIRCLE);
  const InfoIcon = getIconsHandler(AppIconType.INFO);
  const canPay = CanPay(details) && isUser;

  const canReceiveCashPayment =
    canAcceptCashPayment &&
    currentRole === UserType.INTERNATIONAL_CARGO_VENDOR &&
    !details?.payment?.hasPaid &&
    details?.isSelfDrop;

  const CommissionDetails = {
    "Commission on Handling Charge": commaSeparator(
      details?.payment?.commission?.totalBaseCharge,
    ),
    "Commission on Freight Charge": commaSeparator(
      details?.payment?.commission?.commissionOnWeight,
    ),
    "Total Commission": commaSeparator(
      details?.payment?.commission?.totalCommission,
    ),
    "Vendor Payment": commaSeparator(details?.payment?.vendorPayment),
    "Aggregator Charge": commaSeparator(details?.payment?.hyrePayment),
  };

  return (
    <>
      <div className={`flex flex-col gap-4  p-4 bg-white text-sm  rounded-3xl`}>
        {/*Title*/}
        <div className={"flex items-center justify-between"}>
          <span className={"text-base font-semibold text-black"}>Receipt</span>
          {!isUser && (
            <Popover
              content={
                <div className={"flex flex-col gap-1"}>
                  {Object.keys(CommissionDetails)?.map((Key) => {
                    const Value = CommissionDetails[Key];
                    return (
                      <div
                        className={"grid grid-cols-[auto_100px] gap-5 text-xs"}
                        key={Key}
                      >
                        <span>{Key}</span>
                        <span className={"text-right"}>Rs. {Value}</span>
                      </div>
                    );
                  })}
                </div>
              }
              title={"Commission Details"}
            >
              <div
                className={
                  "flex items-center gap-1 text-blue-500 cursor-pointer"
                }
              >
                <span className={"text-sm text-gray-500"}>Commission</span>
                <InfoIcon />
              </div>
            </Popover>
          )}
        </div>
        {/*Billing details*/}
        <BillingAmountDetails
          additionalCharge={details?.charges}
          charge={details?.payment}
        />
        {details?.payment?.hasPaid ? (
          <div className={"flex items-start gap-1 text-sm"}>
            <CheckIcon className={"text-success text-xl"} />
            <div>
              <span className={"text-success"}>Payment successful</span>
              <div className={"flex flex-col gap-1"}>
                <div className={"flex items-center gap-2 text-xs"}>
                  <div>
                    {capitalizeFirstLetter(details?.payment?.paymentSource)}{" "}
                    payment {details?.payment?.remarks}
                  </div>
                  <div className={"text-ash-500"}>
                    {moment(details?.payment?.paidAt).format(
                      "DD MMM,YYYY hh:mm A",
                    )}
                  </div>
                </div>
                <div>
                  {details?.payment?.proofOfReceipt?.length > 0 && (
                    <ViewFile
                      className={"max-h-[60px] max-w-[60px] rounded-md"}
                      name={details?.payment?.proofOfReceipt}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {!isUser || canPay ? (
              <div
                className={"text-gray-500 flex items-center gap-1 text-base"}
              >
                Payment:{" "}
                <AiFillCloseCircle className={"text-red-500 text-xl"} />
                <span className={"text-red-500 text-base"}>Not paid</span>
              </div>
            ) : (
              <div className={"text-red-500"}>
                *Displayed price is an estimate. Payment will be processed only
                after confirmed by vendor.
              </div>
            )}
          </div>
        )}
        {canPay && <WalletPayment details={details} activityId={id} />}
        {canReceiveCashPayment && <ReceiveCashPayment details={details} />}
      </div>
    </>
  );
}

const ReceiveCashPayment = ({ details }: { details: IOrder }) => {
  const [isOpen, setOpen] = useState(false);
  const CheckIcon = getIconsHandler(AppIconType.CHECK_CIRCLE);
  const { receiveCashPayment, getDetailsHandler } = useContext(OrderContext);
  const onSubmit = async (values: any) => {
    await receiveCashPayment(
      {
        ...values,
        proofOfReceipt: values?.proofOfReceipt ? [values?.proofOfReceipt] : [],
      },
      {
        onSuccess: async () => {
          await getDetailsHandler(details?._id);
        },
      },
    );
  };
  return (
    <div>
      {/*  remarks, proof of receipt*/}
      <MyButton
        block
        className={"rounded-full"}
        color={"green"}
        onClick={() => setOpen(true)}
        name={"Receive cash payment"}
      />
      {isOpen && (
        <MyModal onCancel={() => setOpen(false)}>
          <Formik
            enableReinitialize
            onSubmit={onSubmit}
            initialValues={{
              _id: details?._id,
              amount: details?.payment?.orderAmount,
              remarks: "",
              proofOfReceipt: "",
            }}
          >
            <Form className={"flex flex-col gap-2 mt-10"}>
              <div className={"flex flex-col items-center gap-2"}>
                <div className={"text-success  rounded-full text-3xl"}>
                  <CheckIcon />
                </div>
                <div className={"flex flex-col  text-center"}>
                  <span className={"text-sm"}>Total received payment</span>
                  <span className={"text-lg font-bold"}>
                    Rs. {commaSeparator(details?.payment?.orderAmount)}
                  </span>
                </div>
              </div>
              <MyInput
                inputType={"text-area"}
                name={"remarks"}
                label={"Remarks"}
                placeholder={"Enter remarks"}
              />
              <MyFile name={"proofOfReceipt"} label={"Payment Receipt"} />

              <MyButton name={"Confirm"} htmlType={"submit"} />
            </Form>
          </Formik>
        </MyModal>
      )}
    </div>
  );
};

const WalletPayment = ({
  details,
  activityId,
}: {
  details: IOrder;
  activityId: string;
}) => {
  const [isOpen, setOpen] = useState(false);
  const { myWallet, makeActivityPaymentHandler } = useContext(WalletContext);
  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    await makeActivityPaymentHandler(
      {
        paymentThrough: values?.paymentThrough,
        activityId: values?._id,
      },
      {
        onSuccess: async (res) => {
          navigate(
            PageLinks.wallet.paymentStatus({
              id: res?.transaction?._id,
              message: res?.message,
              status: 1,
            }),
          );
        },
        onError: async (res) => {
          navigate(
            PageLinks.wallet.paymentStatus({
              message: res?.message,
              status: 0,
            }),
          );
        },
      },
    );
  };

  const totalPayableAmount = details?.payment?.orderAmount;
  const availableBalanceInWallet = myWallet?.availableBalance;

  const canPayThroughWallet = totalPayableAmount <= availableBalanceInWallet;
  const RadioOnIcon = getIconsHandler(AppIconType.RADIO_ON);
  const RadioOffIcon = getIconsHandler(AppIconType.RADIO_OFF);
  const WalletIcon = getIconsHandler(AppIconType.WALLET);
  return (
    <>
      {/*  remarks, proof of receipt*/}
      <MyButton
        block
        className={"rounded-full"}
        variant={"solid"}
        color={"green"}
        onClick={() => setOpen(true)}
        name={`Pay Rs.${commaSeparator(details?.payment?.orderAmount)}`}
      />
      {isOpen && (
        <MyModal onCancel={() => setOpen(false)} title={"Proceed to pay"}>
          <Formik
            enableReinitialize
            onSubmit={onSubmit}
            initialValues={{
              _id: activityId,
              paymentThrough: canPayThroughWallet
                ? PaymentThrough.HYRE_WALLET
                : PaymentThrough.ESEWA,
            }}
          >
            {({ values, setFieldValue }) => {
              const selectedMedium = values?.paymentThrough;
              const isHyreWallet =
                selectedMedium === PaymentThrough.HYRE_WALLET;
              const isEsewaWallet = selectedMedium === PaymentThrough.ESEWA;
              return (
                <Form className={"flex flex-col gap-4 mt-5"}>
                  {/*Hyre  Wallet*/}
                  <div className={"flex flex-col gap-2 "}>
                    <span className={"text-xs "}>
                      Use Hyre Wallet to pay Rs.{" "}
                      {commaSeparator(totalPayableAmount)}
                    </span>
                    <div
                      className={`flex items-center justify-between border-2 cursor-pointer ${canPayThroughWallet ? "cursor-not-allowed" : ""} ${isHyreWallet ? "border-blue-500" : ""} rounded-md p-2`}
                      onClick={() => {
                        canPayThroughWallet &&
                          setFieldValue(
                            "paymentThrough",
                            PaymentThrough?.HYRE_WALLET,
                          );
                      }}
                    >
                      <div className={"flex flex-col"}>
                        <div
                          className={`flex items-center gap-2 font-medium  text-lg`}
                        >
                          <WalletIcon className={"text-black"} />{" "}
                          <span> Hyre Wallet</span>
                        </div>
                        <span className={"text-gray-500 text-xs"}>
                          Available Balance Rs.
                          {commaSeparator(availableBalanceInWallet) || "0"}
                        </span>
                      </div>
                      <div className={"text-lg"}>
                        {isHyreWallet ? (
                          <RadioOnIcon className={"text-blue-500"} />
                        ) : (
                          <RadioOffIcon />
                        )}
                      </div>
                    </div>
                  </div>{" "}
                  {/*Esewa  Wallet*/}
                  <div className={"flex flex-col gap-2"}>
                    <span className={"text-xs"}>
                      Use Esewa to pay Rs. {commaSeparator(totalPayableAmount)}
                    </span>
                    <div
                      className={`flex items-center justify-between border-2 cursor-pointer ${isEsewaWallet ? "border-blue-500" : ""} rounded-md p-2`}
                      onClick={() => {
                        canPayThroughWallet &&
                          setFieldValue("paymentThrough", PaymentThrough.ESEWA);
                      }}
                    >
                      <div className={"flex gap-2 items-center"}>
                        <img
                          src={Esewa}
                          alt={"esewa"}
                          className={"w-[30px] object-contain"}
                        />
                        <span className={"font-medium text-lg"}>Esewa</span>
                      </div>
                      <div className={"text-lg"}>
                        {isEsewaWallet ? (
                          <RadioOnIcon className={"text-blue-500"} />
                        ) : (
                          <RadioOffIcon />
                        )}
                      </div>
                    </div>
                  </div>
                  <MyButton
                    name={`Pay Rs.${commaSeparator(totalPayableAmount)}`}
                    htmlType={"submit"}
                  />
                </Form>
              );
            }}
          </Formik>
        </MyModal>
      )}
    </>
  );
};

export default BillingDetailsComponent;

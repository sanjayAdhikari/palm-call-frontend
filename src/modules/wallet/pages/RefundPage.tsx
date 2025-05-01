import React, { useContext, useEffect, useState } from "react";
import {
  MyButton,
  MyInput,
  MyModal,
  MySegmented,
  MyTable,
  PageTemplate,
  UserProfileCard,
} from "components";
import {
  AppIconType,
  GeneralStatusEnum,
  ITableColumns,
  IWalletRefund,
} from "interfaces";
import moment from "moment";
import { Outlet, useNavigate } from "react-router-dom";
import { useQueryParams, useScreenSize } from "hooks";
import { RefundContext } from "context";
import { capitalizeFirstLetter, commaSeparator, getIconsHandler } from "utils";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { PageLinks } from "constant";
import { Popover } from "antd";

function RefundPage() {
  const { isLoading, lists, getListHandler } = useContext(RefundContext);
  const [activeTab, setActiveTab] = useState<GeneralStatusEnum>(
    GeneralStatusEnum.PENDING,
  );
  const { getResponsiveBackLink } = useQueryParams();
  const fetchHandler = async () => {
    await getListHandler({ status: activeTab });
  };
  useEffect(() => {
    (async () => {
      await fetchHandler();
    })();
  }, [activeTab]);

  const { isSmScreen } = useScreenSize();
  const navigate = useNavigate();
  const { goToActivityDetails } = useQueryParams();
  const InfoIcon = getIconsHandler(AppIconType.INFO);

  const TableColumns: ITableColumns<IWalletRefund>[] = [
    {
      title: "Date",
      render: (value, record) => {
        return moment(record?.updatedAt).format("YYYY-MM-DD hh:mm A");
      },
    },
    {
      title: "Customer",
      render: (value, record) => {
        return <UserProfileCard name={record?.owner?.name} />;
      },
    },
    {
      title: "Refund Mode",
      render: (value, record) => {
        return capitalizeFirstLetter(record?.refundMode);
      },
    },
    {
      title: "Amount",
      render: (value, record) => {
        const AmountDetails = {
          "Hyre Payment": commaSeparator(record?.paymentDetail?.hyrePayment),
          "Vendor Payment": commaSeparator(
            record?.paymentDetail?.vendorPayment,
          ),
          "Coupon discount": commaSeparator(
            record?.paymentDetail?.couponDiscount,
          ),
          "Total Amount": commaSeparator(record?.paymentDetail?.orderAmount),
        };
        return (
          <div>
            <Popover
              content={
                <div className={"flex flex-col gap-1"}>
                  {Object.keys(AmountDetails)?.map((Key) => {
                    const Value = AmountDetails[Key];
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
              title={"Amount Details"}
            >
              <div
                className={
                  "flex items-center gap-1 text-blue-500 cursor-pointer"
                }
              >
                <span className={"text-sm text-gray-500"}>
                  Rs. {commaSeparator(record?.paymentDetail?.orderAmount)}
                </span>
                <InfoIcon />
              </div>
            </Popover>
          </div>
        );
      },
    },
    {
      title: "Refunded Amount",
      render: (value, record) => {
        return `Rs. ${commaSeparator(record?.refundedAmount)}`;
      },
    },
    {
      title: " ",
      render: (value, record) => {
        return (
          <div className={"flex items-center gap-2"}>
            <MyButton
              name={"Activity"}
              size={"middle"}
              variant={"outlined"}
              onClick={() => goToActivityDetails(record?.activityID)} // TODO: replace with order id
              iconType={AppIconType.PARCEL}
            />{" "}
            {record?.settlementTxnID && (
              <MyButton
                name={"Transaction"}
                variant={"outlined"}
                onClick={() =>
                  navigate(
                    PageLinks.wallet.transactionDetails(
                      record?.settlementTxnID,
                    ),
                  )
                }
                size={"middle"}
                iconType={AppIconType.WALLET}
              />
            )}
            {record?.status === GeneralStatusEnum.PENDING && (
              <RefundRequestComponent record={record} />
            )}
          </div>
        );
      },
    },
  ];
  return (
    <PageTemplate backLink={getResponsiveBackLink()} title={"Refund"}>
      <div className={"flex flex-col gap-5"}>
        <div className={"flex justify-center"}>
          <MySegmented
            activeTab={activeTab}
            setActiveTab={(val: any) => setActiveTab(val)}
            tabs={[
              {
                label: "Pending",
                key: GeneralStatusEnum.PENDING,
              },

              {
                label: "Done",
                key: GeneralStatusEnum.DONE,
              },
              {
                label: "Cancelled",
                key: GeneralStatusEnum.CANCELLED,
              },
            ]}
          />
        </div>

        <MyTable
          hideHeader={isSmScreen}
          isLoading={isLoading}
          columns={TableColumns}
          data={lists?.docs}
        />
        <Outlet />
      </div>
    </PageTemplate>
  );
}

function RefundRequestComponent({ record }: { record: IWalletRefund }) {
  const [isOpen, setOpen] = useState(false);
  const { acceptRejectHandler, getListHandler } = useContext(RefundContext);

  const onSubmitHandler = async (values: any) => {
    await acceptRejectHandler(
      {
        type: values?.type,
        id: values?.id,
        remarks: values?.remarks,
        amount: values?.amount,
      },
      {
        onSuccess: async () => {
          await getListHandler();
          setOpen(false);
        },
      },
    );
  };
  return (
    <>
      <MyButton
        size={"middle"}
        color={"blue"}
        iconType={AppIconType.RIGHT_ARROW}
        onClick={() => setOpen(true)}
        name={"Proceed"}
        iconPosition={"end"}
      />
      {isOpen && (
        <MyModal title={"Withdraw Request"} onCancel={() => setOpen(false)}>
          <Formik
            validationSchema={yup.object().shape({
              amount: yup.number().min(1, "").required(" "),
            })}
            initialValues={{
              id: record?._id,
              amount: record?.paymentDetail?.orderAmount,
              type: "accept",
            }}
            onSubmit={onSubmitHandler}
          >
            {({ setFieldValue, handleSubmit }) => {
              return (
                <Form className={"flex flex-col gap-2"}>
                  <div className={"text-red-500 pb-2 rounded-md"}>
                    <span>
                      Requested amount: Rs.{" "}
                      {commaSeparator(record?.paymentDetail?.orderAmount)}
                    </span>
                  </div>

                  <MyInput
                    placeholder={"Enter amount"}
                    name={"amount"}
                    inputType={"number"}
                    label={
                      "Withdrawal Amount (This is the amount that will be credited to the customer’s account)"
                    }
                    isRequired
                  />
                  <MyInput
                    placeholder={"Enter remarks"}
                    name={"remarks"}
                    inputType={"text-area"}
                    label={"Remarks"}
                  />
                  <MyButton name={"Approve"} htmlType={"submit"} />
                  <MyButton
                    name={"Reject"}
                    color={"red"}
                    variant={"text"}
                    onClick={async () => {
                      await setFieldValue("type", "reject");
                      handleSubmit();
                    }}
                  />
                </Form>
              );
            }}
          </Formik>
        </MyModal>
      )}
    </>
  );
}

export default RefundPage;

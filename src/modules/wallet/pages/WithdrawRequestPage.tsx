import React, { useContext, useEffect, useState } from "react";
import {
  MyButton,
  MyFile,
  MyInput,
  MyModal,
  MySegmented,
  MyTable,
  PageTemplate,
  ViewFile,
  Wallet,
} from "components";
import {
  GeneralStatusEnum,
  ITableColumns,
  IWithdraw,
  UserType,
  WithdrawMethodEnum,
} from "interfaces";
import moment from "moment";
import { Outlet } from "react-router-dom";
import { useAuthorization, useQueryParams, useScreenSize } from "hooks";
import { WithdrawContext } from "context";
import { capitalizeFirstLetter, commaSeparator, StatusColor } from "utils";
import { Form, Formik } from "formik";
import * as yup from "yup";

function WithdrawRequestPage() {
  const { isLoading, lists, getListHandler, currentPage } =
    useContext(WithdrawContext);
  const [activeTab, setActiveTab] = useState<GeneralStatusEnum>(
    GeneralStatusEnum.PENDING,
  );
  const { getResponsiveBackLink } = useQueryParams();
  const fetchHandler = async ({ currentPage }: { currentPage?: number }) => {
    await getListHandler({
      status: activeTab,
      page: currentPage,
      havePagination: true,
    });
  };
  const { currentRole } = useAuthorization();
  const isAdmin = currentRole === UserType.HYRE;
  useEffect(() => {
    (async () => {
      await fetchHandler({ currentPage: 1 });
    })();
  }, [activeTab]);

  const { isSmScreen } = useScreenSize();
  const AccountDetails = ({ withdraw }: { withdraw: IWithdraw }) => {
    const details = withdraw?.withdrawnTo;
    return (
      <div>
        {details?.method === WithdrawMethodEnum.ESEWA ||
        details?.method === WithdrawMethodEnum.KHALTI ? (
          <div className={"flex flex-col text-sm"}>
            <span>{capitalizeFirstLetter(details?.method)}</span>
            <span>{details?.mobileNumber}</span>
          </div>
        ) : (
          <div className={"flex flex-col "}>
            <span>{details?.bankName}</span>
            <span>Name: {details?.bankAccountName}</span>
            <span>A/C number: {details?.bankAccountNumber}</span>
          </div>
        )}
      </div>
    );
  };

  const TableColumns: ITableColumns<IWithdraw>[] = [
    {
      title: "Date",
      hidden: isSmScreen,
      render: (value, record) => {
        return moment(record?.updatedAt).format("YYYY-MM-DD hh:mm A");
      },
    },
    {
      title: "Details",
      hidden: !isSmScreen,
      render: (value, record) => {
        return (
          <div className={"w-full bg-bgSecondary p-3 rounded-md"}>
            <div className={"flex items-center justify-between"}>
              <span>
                {moment(record?.updatedAt).format("YYYY-MM-DD hh:mm A")}
              </span>
              <div
                style={{ background: StatusColor?.[record?.status] }}
                className={`text-white rounded-md px-2 py-1 text-xs`}
              >
                {capitalizeFirstLetter(record?.status)}
              </div>
            </div>
            <div className={"flex flex-col border-t mt-2 pt-2"}>
              <div className={"text-xs text-gray-500"}>Requested By</div>
              <div className={"text-black"}>
                {record?.owner?.name?.first || "N/A"}{" "}
                {record?.owner?.name?.last} ({record?.ownerType})
              </div>
            </div>
            <div className={"flex flex-col  pt-2"}>
              <div className={"text-xs text-gray-500"}>Reasons</div>
              <div className={"text-black"}>
                {record?.customerReason || "N/A"}
              </div>
            </div>
            <div className={"grid grid-cols-2 gap-5 border-t mt-2 pt-2"}>
              <div className={"flex flex-col"}>
                <div className={"text-xs text-gray-500"}>Requested Amt.</div>
                <div className={"text-black"}>
                  Rs. {record?.requestedAmount}
                </div>
              </div>
              <div className={"flex flex-col"}>
                <div className={"text-xs text-gray-500"}>Withdraw Amt.</div>
                <div className={"text-black"}>Rs. {record?.withdrawAmount}</div>
              </div>
            </div>
            <div className={"border-t mt-2 pt-2"}>
              <AccountDetails withdraw={record} />
            </div>
            <div className={"flex flex-col border-t mt-2 pt-2"}>
              <div className={"text-xs text-gray-500"}>Admin Remarks</div>
              <div className={"text-black"}>
                {record?.adminRemarks || "N/A"}
              </div>
            </div>{" "}
            <div className={"flex flex-col gap-1 border-t mt-2 pt-2"}>
              <div className={"text-xs text-gray-500"}>Proof of payments</div>
              <div className={"text-black"}>
                {record?.proofOfPayment &&
                record?.proofOfPayment?.length > 0 ? (
                  <ViewFile
                    className={"max-w-[40px] max-h-[40px] rounded-md"}
                    name={record?.proofOfPayment}
                  />
                ) : (
                  <>N/A</>
                )}
              </div>
            </div>
            {record?.status === GeneralStatusEnum.PENDING && isAdmin && (
              <div className={"w-full mt-2"}>
                <WithdrawRequestComponent record={record} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Requested by",
      hidden: isSmScreen || !isAdmin,
      render: (value, record) => {
        return (
          <div className={"flex flex-col"}>
            <span>
              {record?.owner?.name?.first || "N/A"} {record?.owner?.name?.last}
            </span>
            <span className={"text-xs text-gray-500"}>{record?.ownerType}</span>
          </div>
        );
      },
    },
    {
      title: "Status",
      hidden: isSmScreen,
      render: (value, record) => {
        const Color = StatusColor[record?.status];
        return (
          <div className={"flex items-start"}>
            <div
              style={{
                background: Color,
              }}
              className={`text-white rounded-md px-2 py-1 text-xs`}
            >
              {capitalizeFirstLetter(record?.status)}
            </div>
          </div>
        );
      },
    },

    {
      title: "A/C Details",
      hidden: isSmScreen,
      render: (value, record) => {
        return <AccountDetails withdraw={record} />;
      },
    },
    {
      title: "Reason",
      hidden: isSmScreen,
      render: (value, record) => {
        return record?.customerReason;
      },
    },
    {
      title: "Remarks",
      hidden: isSmScreen,
      render: (value, record) => {
        return record?.adminRemarks || "N/A";
      },
    },

    {
      title: "Requested Amount",
      hidden: isSmScreen,
      render: (value, record) => {
        return `Rs. ${commaSeparator(record?.requestedAmount)}`;
      },
    },
    {
      title: "Withdraw Amount",
      hidden: isSmScreen,
      render: (value, record) => {
        return (
          <span
            className={`${isAdmin ? "text-red-500" : "text-green-500"}`}
          >{`Rs. ${commaSeparator(record?.withdrawAmount)}`}</span>
        );
      },
    },
    {
      title: "Proof of Payment",
      hidden: isSmScreen,
      render: (value, record) => {
        return record?.proofOfPayment && record?.proofOfPayment?.length > 0 ? (
          <ViewFile
            className={"max-w-[40px] max-h-[40px] rounded-md"}
            name={record?.proofOfPayment}
          />
        ) : (
          <div>N/A</div>
        );
      },
    },
    {
      title: "",
      hidden: isSmScreen || !isAdmin,
      render: (value, record) => {
        return (
          record?.status === GeneralStatusEnum.PENDING && (
            <WithdrawRequestComponent record={record} />
          )
        );
      },
    },
  ];
  return (
    <PageTemplate
      backLink={getResponsiveBackLink()}
      title={"Withdraw Requests"}
    >
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
          pagination={{
            currentPage,
            totalDocs: lists?.totalDocs,
            onChange: async (page) => {
              await fetchHandler({
                currentPage: page,
              });
            },
          }}
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

function WithdrawRequestComponent({ record }: { record: IWithdraw }) {
  const [isOpen, setOpen] = useState(false);
  const { acceptRejectHandler, getListHandler } = useContext(WithdrawContext);

  const onSubmitHandler = async (values: any) => {
    await acceptRejectHandler(
      {
        type: values?.type,
        id: values?.id,
        remarks: values?.remarks,
        amount: values?.amount,
        proofOfPayment: [values?.proofOfPayment],
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
        block
        variant={"outlined"}
        size={"middle"}
        onClick={() => setOpen(true)}
        name={"Proceed"}
      />
      {isOpen && (
        <MyModal title={"Withdraw Request"} onCancel={() => setOpen(false)}>
          <Formik
            validationSchema={yup.object().shape({
              amount: yup.number().min(1, "").required(" "),
            })}
            initialValues={{
              id: record?._id,
              amount: record?.requestedAmount,
              type: "accept",
              proofOfPayment: "",
            }}
            onSubmit={onSubmitHandler}
          >
            {({ setFieldValue, handleSubmit }) => {
              return (
                <Form className={"flex flex-col gap-2"}>
                  <Wallet
                    type={"summery"}
                    ownerType={record?.ownerType}
                    ownerId={record?.owner?._id}
                  />
                  <div className={"text-red-500 pb-2 rounded-md"}>
                    <span>Requested amount: Rs. {record?.requestedAmount}</span>
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
                  <MyFile name={"proofOfPayment"} label={"Proof of payment"} />
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

export default WithdrawRequestPage;

import React, { useContext, useEffect, useState } from "react";
import {
  MyButton,
  MySegmented,
  MyTable,
  PageTemplate,
  ViewFile,
  KYCDetails,
  TransactionTableColumn,
  Wallet,
  VendorDetails,
} from "components";
import { PageLinks } from "constant";

import { useQueryParams } from "hooks";
import {
  CustomerContext,
  KycContext,
  OrderContext,
  RatingContext,
  TransactionContext,
  VendorContext,
} from "context";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppIconType,
  IKyc,
  IOrder,
  IRating,
  ITableColumns,
  IUser,
  IVendor,
  KycStatusEnum,
  PackageStatusEnum,
  ParamsNames,
  UserType,
  WalletOwnerTypeEnum,
} from "interfaces";
import {
  capitalizeFirstLetter,
  commaSeparator,
  getIconsHandler,
  getPackageStatusColor,
} from "utils";
import moment from "moment";
import { Rate, Skeleton } from "antd";
import { KYC_MESSAGE } from "../../kyc/helpers";

enum Tabs {
  "TRANSACTIONS" = "TRANSACTIONS",
  "ORDERS" = "ORDERS",
  "KYC" = "KYC",
  "REVIEW_RECEIVED" = "REVIEW_RECEIVED",
  "REVIEW_GIVEN" = "REVIEW_GIVEN",
}
function ProfilePage() {
  const params = useParams<ParamsNames>();
  const userType: any = params.TYPE;
  const id = params.ID;
  const { getResponsiveBackLink } = useQueryParams();
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.KYC);
  const { getListHandler: getTransactionHandler } =
    useContext(TransactionContext);
  const { getMyKycHandler: getKYCDetails, myKyc: kycDetails } =
    useContext(KycContext);
  const { getListHandler: getOrdersHandler } = useContext(OrderContext);
  const { getDetailsHandler: getVendorDetailsHandler, details: vendorDetails } =
    useContext(VendorContext);
  const {
    getDetailsHandler: getCustomerDetailsHandler,
    details: customerDetails,
  } = useContext(CustomerContext);
  const {
    getAverageRatingHandler,
    averageRating,
    getListHandler: getReceivedRatingHandler,
    getGivenRatingHandler,
  } = useContext(RatingContext);
  const isUser = userType == UserType.USER;
  useEffect(() => {
    (async () => {
      const query = {
        ...(isUser ? { customerID: id } : { vendorID: id }),
        havePagination: true,
      };
      setLoading(true);
      await Promise.all([
        getAverageRatingHandler(query),
        getOrdersHandler(query),
        getTransactionHandler(query),
        getReceivedRatingHandler(query),
        getGivenRatingHandler(query),
        ...(isUser
          ? [getKYCDetails({ customerID: id }), getCustomerDetailsHandler(id)]
          : [getVendorDetailsHandler(id)]),
      ]);
      setLoading(false);
    })();
  }, [userType, id]);
  return (
    <div
      className={
        "grid sm:grid-cols-[400px_auto] grid-cols-1 sm:h-full h-auto overflow-y-scroll gap-5"
      }
    >
      <PageTemplate
        transparentPage
        backLink={getResponsiveBackLink()}
        title={
          isLoading ? "Profile" : isUser ? "User Profile" : "Vendor Profile"
        }
      >
        <div
          className={"flex flex-col gap-5 sm:h-full h-auto overflow-y-scroll"}
        >
          <UserDetails
            averageRating={averageRating?.average}
            customerDetails={customerDetails}
            vendorDetails={vendorDetails}
            userType={userType}
            id={id}
            isLoading={isLoading}
          />
        </div>
      </PageTemplate>
      <PageTemplate>
        <div
          className={
            "flex flex-col gap-5 sm:h-full h-auto sm:overflow-y-scroll overflow-auto"
          }
        >
          <div className={"flex justify-center "}>
            <MySegmented
              activeTab={activeTab}
              setActiveTab={(value: any) => setActiveTab(value)}
              tabs={[
                {
                  label: isUser ? "KYC" : "Profile",
                  key: Tabs.KYC,
                },
                {
                  label: "Transactions",
                  key: Tabs.TRANSACTIONS,
                },
                {
                  label: "Orders",
                  key: Tabs.ORDERS,
                },
                {
                  label: "Review Received",
                  key: Tabs.REVIEW_RECEIVED,
                },
                {
                  label: "Review Provided",
                  key: Tabs.REVIEW_GIVEN,
                },
              ]}
            />
          </div>

          {activeTab === Tabs.TRANSACTIONS ? (
            <TransactionTab />
          ) : activeTab === Tabs.ORDERS ? (
            <OrderTab isUser={isUser} id={id} />
          ) : activeTab === Tabs.KYC ? (
            <KYCTab
              vendorDetails={vendorDetails}
              isUser={isUser}
              kycDetails={kycDetails}
            />
          ) : (
            <RatingTab
              showGivenRating={activeTab == Tabs.REVIEW_GIVEN}
              isUser={isUser}
              id={id}
            />
          )}
        </div>
      </PageTemplate>
    </div>
  );
}

const TransactionTab = () => {
  const navigate = useNavigate();
  const TableColumns = TransactionTableColumn();
  const {
    getListHandler: getTransactionHandler,
    lists: transactions,
    isLoading,
  } = useContext(TransactionContext);
  return (
    <MyTable
      onRowClickHandler={(data, index) => {
        navigate(PageLinks.wallet.transactionDetails(data?._id));
      }}
      isLoading={isLoading}
      columns={TableColumns}
      data={transactions?.docs}
    />
  );
};
const OrderTab = ({ isUser, id }) => {
  const {
    getListHandler: getOrdersHandler,
    lists: orders,
    isLoading,
    currentPage,
  } = useContext(OrderContext);
  const { goToActivityDetails } = useQueryParams();

  const TableColumns: ITableColumns<IOrder>[] = [
    {
      title: "Date",
      render: (value, record) =>
        moment(record?.bookedDate).format("YYYY-MM-DD"),
    },
    {
      title: "Waybill",
      render: (value, record) => record?.wayBillNumber,
    },
    {
      title: "Status",
      render: (value, record) => {
        const statusLabel =
          record?.status === PackageStatusEnum.SHIPMENT_ORDERED
            ? "Order request"
            : capitalizeFirstLetter(record?.status);
        const statusColor = getPackageStatusColor(record?.status);
        return (
          <div
            style={{
              color: statusColor,
            }}
          >
            {statusLabel}
          </div>
        );
      },
    },
    {
      title: "Source",
      render: (value, record) => (
        <div>{capitalizeFirstLetter(record?.sourceCountry)}</div>
      ),
    },
    {
      title: "Destination",
      render: (value, record) => (
        <div>{capitalizeFirstLetter(record?.destinationCountry)}</div>
      ),
    },

    {
      title: "Amount",
      render: (value, record) =>
        `Rs.${commaSeparator(record?.payment?.orderAmount)}`,
    },
    {
      title: "",
      render: (value, record) => {
        return (
          <MyButton
            name={"Details"}
            color={"blue"}
            size={"small"}
            variant={"outlined"}
            iconPosition={"end"}
            iconType={AppIconType.RIGHT_ARROW}
            onClick={() => {
              goToActivityDetails(record?._id);
            }}
          />
        );
      },
    },
  ];

  return (
    <MyTable
      pagination={{
        currentPage,
        totalDocs: orders?.totalDocs,
        onChange: async (page) => {
          await getOrdersHandler({
            havePagination: true,
            page: page,
            ...(isUser ? { customerID: id } : { vendorID: id }),
          });
        },
      }}
      isLoading={isLoading}
      columns={TableColumns}
      data={orders?.docs}
    />
  );
};
const RatingTab = ({ isUser, id, showGivenRating }) => {
  const {
    givenRating,
    getGivenRatingHandler,
    getListHandler: getReceivedRatingHandler,
    lists: receivedRating,
    isGivenRatingLoading,
    isLoading: isReceivedRatingLoading,
    currentPage: receivedCurrentPage,
    givenRatingCurrentPage,
  } = useContext(RatingContext);

  const TableColumns: ITableColumns<IRating>[] = [
    {
      title: "Date",
      render: (value, record) => moment(record?.createdAt).format("YYYY-MM-DD"),
    },
    {
      title: "Rating",
      render: (value, record) => <Rate disabled value={record?.rating} />,
    },
    {
      title: "Review",
      render: (value, record) => record?.reviews?.join(", "),
    },
  ];
  let currentPage = showGivenRating
    ? givenRatingCurrentPage
    : receivedCurrentPage;
  let totalDocs = showGivenRating
    ? givenRating?.totalDocs
    : receivedRating?.totalDocs;
  let isLoading = showGivenRating
    ? isGivenRatingLoading
    : isReceivedRatingLoading;
  let data = showGivenRating ? givenRating?.docs : receivedRating?.docs;
  const fetchHandler = showGivenRating
    ? getGivenRatingHandler
    : getReceivedRatingHandler;
  return (
    <MyTable
      pagination={{
        currentPage,
        totalDocs,
        onChange: async (page) => {
          await fetchHandler({
            havePagination: true,
            page: page,
            ...(isUser ? { customerID: id } : { vendorID: id }),
          });
        },
      }}
      isLoading={isLoading}
      columns={TableColumns}
      data={data}
    />
  );
};
const KYCTab = ({
  kycDetails,
  vendorDetails,
  isUser,
}: {
  kycDetails: IKyc;
  vendorDetails: IVendor;
  isUser: boolean;
}) => {
  const StatusDetails = KYC_MESSAGE?.[kycDetails?.status];
  if (isUser) {
    return (
      <div className={"flex flex-col gap-4"}>
        <div className={"flex justify-start"}>
          <div
            className={"text-white text-sm p-1 px-2 rounded-3xl"}
            style={{
              backgroundColor: StatusDetails?.color,
            }}
          >
            {capitalizeFirstLetter(kycDetails?.status)}
          </div>
        </div>

        <KYCDetails details={kycDetails} />
      </div>
    );
  } else {
    return <VendorDetails details={vendorDetails} />;
  }
};

const UserDetails = ({
  id,
  userType,
  customerDetails,
  vendorDetails,
  isLoading,
  averageRating,
}: {
  id: string;
  userType: UserType;
  customerDetails: IUser;
  vendorDetails: IVendor;
  isLoading?: boolean;
  averageRating?: number;
}) => {
  const CheckIcon = getIconsHandler(AppIconType.CHECK);
  const isCustomer = userType == UserType.USER;
  const details = (() => {
    return {
      profileImage: isCustomer
        ? customerDetails?.profileImage
        : vendorDetails?.logo || vendorDetails?.profileImage,
      isVerified: isCustomer
        ? customerDetails?.kycStatus == KycStatusEnum.VERIFIED
        : vendorDetails?.kycStatus === KycStatusEnum.VERIFIED,
      name: isCustomer
        ? `${customerDetails?.name?.first || ""} ${customerDetails?.name?.last || ""}`
        : vendorDetails?.legalName,
      email: isCustomer ? customerDetails?.email : vendorDetails?.primaryEmail,
      rating: averageRating,
    };
  })();
  if (isLoading) {
    return <Skeleton active />;
  }
  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex flex-col sm:py-2 py-5 items-center justify-center"}>
        <div className={"flex flex-col items-center gap-4"}>
          {details?.profileImage ? (
            <div
              className={
                "relative  h-20 w-20 max-h-20 max-w-20 rounded-full bg-ash-100"
              }
            >
              <ViewFile
                canPreview={false}
                name={[details?.profileImage]}
                className={
                  "sm:max-w-20 sm:max-h-20 max-h-28 max-w-28 rounded-full object-cover"
                }
              />
              {details?.isVerified && (
                <div
                  className={
                    "absolute sm:bottom-[0px] bottom-1 right-1 bg-green-500 shadow-lg text-white rounded-full p-1 border-2 border-white"
                  }
                >
                  <CheckIcon className={"text-xs"} />
                </div>
              )}
            </div>
          ) : (
            <div className={"h-28 w-28 rounded-full bg-gray-200"}></div>
          )}
          <div className={"flex flex-col items-center"}>
            <span className={"text-xl font-medium"}>{details?.name}</span>
            <span className={"text-sm text-gray-500"}>
              {details?.email || ""}
            </span>
            <Rate disabled value={details?.rating} />
          </div>
        </div>
      </div>
      <Wallet
        ownerId={id}
        ownerType={
          isCustomer ? WalletOwnerTypeEnum.CUSTOMER : WalletOwnerTypeEnum.VENDOR
        }
        type={"summery"}
      />
    </div>
  );
};
export default ProfilePage;

import React, { useContext, useEffect, useState } from "react";
import { EmptyMessageComponent, MyButton, PageTemplate } from "components";
import { ActivityContext } from "../context";
import { OrderContext } from "context";
import {
  AppIconType,
  IOrder,
  PackageStatusEnum,
  ParamsNames,
  QueryNames,
  UserType,
} from "interfaces";
import { getIconsHandler, ReviewLabel } from "utils";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useApiManager,
  useAuthorization,
  useQueryParams,
  useScreenSize,
} from "hooks";
import {
  ApplyCouponForm,
  BillingDetailsComponent,
  TimelineComponent,
} from "../components";
import { PageLinks } from "constant";
import { Popover, Rate, Skeleton } from "antd";
import {
  AddressLabelReport,
  BoxLabelReport,
  InvoiceReport,
  WayBillReport,
} from "../reports";
import VendorAndTripDetails from "../components/VendorAndTripDetailsComponent";
import { getEditableFields } from "../helpers";
import { Form, Formik } from "formik";
import { RatingContext } from "context";

function ActivityDetailsPage() {
  const params = useParams<ParamsNames>();
  const [query] = useSearchParams();
  const ID = params?.ID || query?.get(QueryNames.ID);
  const { currentRole, isUser, isAdmin } = useAuthorization();
  const navigate = useNavigate();

  const BackIcon = getIconsHandler(AppIconType.BACK);

  const {
    getDetailsHandler: getActivityDetailsHandler,
    isDetailsLoading: isActivityDetailsLoading,
    details: activityDetails,
  } = useContext(ActivityContext);
  const {
    getDetailsHandler: getOrderDetailsHandler,
    isDetailsLoading: isOrderDetailsLoading,
    details: orderDetails,
  } = useContext(OrderContext);
  const idOf = currentRole === UserType.USER ? "activity" : "order";

  const details = (() => {
    if (currentRole === UserType.USER) {
      return activityDetails?.courier?.order;
    } else {
      return orderDetails;
    }
  })();
  const { isSmScreen } = useScreenSize();
  const getDetailsHandler = (id: string) => {
    if (currentRole === UserType.USER) {
      return getActivityDetailsHandler(id);
    } else {
      return getOrderDetailsHandler(id);
    }
  };
  const { goToSupportDetails } = useQueryParams();

  const { showVerifiedPackage, canEditOrdersByVendor } = getEditableFields(
    details?.status,
  );
  const canRate =
    !isAdmin &&
    !details?.isFIT &&
    details?.status === PackageStatusEnum.SHIPMENT_DELIVERED;
  useEffect(() => {
    (async () => {
      if (!ID) return;
      await getDetailsHandler(ID);
    })();
  }, [ID]);
  const isDetailsLoading = isOrderDetailsLoading || isActivityDetailsLoading;
  return (
    <PageTemplate
      transparentPage
      backLink={isSmScreen && PageLinks.activity.list}
      title={
        <div className={"flex items-center gap-2"}>
          <span className={"font-bold text-xl"}>Shipping Order</span>
          {!isUser && (
            <div
              className={`${details?.isFIT ? "bg-gray-300" : "bg-black"}  text-white text-center text-sm  p-1 px-2`}
            >
              {details?.isFIT ? "Manual" : "Hyre"}
            </div>
          )}
        </div>
      }
      titleRightChildren={
        <MyButton
          iconType={AppIconType.SUPPORT}
          size={"large"}
          className={"rounded-full text-xl"}
          variant={"filled"}
          color={"default"}
          onClick={() => {
            goToSupportDetails({
              activity: idOf === "activity" ? ID : "",
              order: idOf === "order" ? ID : "",
            });
          }}
        />
      }
    >
      <div className={"flex  h-full w-full  flex-col overflow-scroll"}>
        {isDetailsLoading ? (
          <Skeleton active round paragraph className={"mt-4"} />
        ) : !details ? (
          <EmptyMessageComponent message={"Something went wrong"} />
        ) : (
          <div
            className={
              "grid sm:grid-cols-2 grid-cols-1 gap-4  h-full sm:overflow-scroll"
            }
          >
            <div className={"flex flex-col gap-4  sm:overflow-scroll"}>
              {/*verified packages*/}
              {showVerifiedPackage && (
                <PackageDetails details={details} id={ID} />
              )}
              {canRate && <RatingCard details={details} />}

              <VendorAndTripDetails details={details} />
            </div>
            <div
              className={"flex flex-col gap-4 w-full h-full sm:overflow-scroll"}
            >
              {!isUser && canEditOrdersByVendor && (
                <>
                  <div className="flex flex-col gap-2 items-start w-full  bg-gradient-to-r from-blue-500 to-purple-600 text-white  rounded-3xl p-4">
                    <div className={"flex flex-col"}>
                      <span className="text-base">
                        Manage Packages & Invoices
                      </span>
                      <span className="text-xs  text-ash-100">
                        Review, approve, and edit incoming package requests.
                        Finalize and generate invoices—all in one place.
                      </span>
                    </div>
                    <div className={"flex items-start"}>
                      <MyButton
                        className={"rounded-full text-white"}
                        onClick={() =>
                          navigate(PageLinks.order.editFIT(details?._id))
                        }
                        iconType={AppIconType.EDIT}
                        name={"Edit"}
                        variant={"filled"}
                        size={"middle"}
                      />
                    </div>
                  </div>
                </>
              )}
              {!isUser && <ReportsCards details={details} />}
              <BillingDetailsComponent id={ID} details={details} />
              <ApplyCouponForm activityId={ID} details={details} />
              <TimelineComponent
                details={details}
                getDetailsHandler={() => getDetailsHandler(ID)}
              />
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

const PackageDetails = ({ details, id }: { details: IOrder; id: string }) => {
  const ParcelIcon = getIconsHandler(AppIconType.PARCEL);
  const InfoIcon = getIconsHandler(AppIconType.INFO);

  return (
    <>
      <div className={"flex flex-col gap-2  bg-white w-full rounded-3xl p-4 "}>
        <span className={"text-base font-semibold text-black"}>
          Verified Parcels
        </span>
        <div className={"flex flex-col gap-2"}>
          {details?.itemsVendor?.map((e, key) => {
            return (
              <div key={e?._id} className={"flex items-start gap-2"}>
                <div className={"bg-ash-50 rounded-full p-1 text-red-500"}>
                  <ParcelIcon />
                </div>
                <div>
                  <div className={"flex items-center gap-2"}>
                    <span>{e?.description}</span>
                    <div className="text-xs text-gray-500">
                      Weight: {e?.chargeableWeight} K.G.
                    </div>
                    <Popover
                      content={
                        <div className={"text-xs flex flex-col gap-2"}>
                          <div className={"flex items-center justify-between"}>
                            <span>Package Weight</span>
                            <span>{e?.weight} K.G.</span>
                          </div>
                          <div className={"flex items-center justify-between"}>
                            <span>Volumetric Weight</span>
                            <span>{e?.volumetricWeight} K.G.</span>
                          </div>
                          <div className={"flex items-center justify-between"}>
                            <span>Chargeable Weight</span>
                            <span>{e?.chargeableWeight} K.G.</span>
                          </div>
                        </div>
                      }
                      title="Weight"
                    >
                      <InfoIcon
                        className={"text-blue-500 text-sm cursor-pointer"}
                      />
                    </Popover>
                  </div>
                  <span className={"text-xs text-gray-500"}>
                    {e?.commodity?.map((e) => e?.name)?.join(", ")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const ReportsCards = ({ details }: { details: IOrder }) => {
  const ReportIcon = getIconsHandler(AppIconType.RECEIPT);
  const ParcelIcon = getIconsHandler(AppIconType.PARCEL);
  const TransferIcon = getIconsHandler(AppIconType.TRANSFER);
  const SendIcon = getIconsHandler(AppIconType.SEND);
  const [showInvoice, setInvoice] = useState(false);
  const [showWaybill, setWaybill] = useState(false);
  const [showBoxLabel, setBoxLabel] = useState(false);
  const [showAddressLabel, setAddressLabel] = useState(false);

  const Labels = [
    {
      title: "Invoice",
      onClick: () => {
        setInvoice(true);
      },
      Icon: ReportIcon,
    },
    {
      title: "Waybill",
      onClick: () => {
        setWaybill(true);
      },
      Icon: TransferIcon,
    },
    {
      title: "Box Label",
      onClick: () => {
        setBoxLabel(true);
      },
      Icon: ParcelIcon,
    },
    {
      title: "Address Label",
      onClick: () => {
        setAddressLabel(true);
      },
      Icon: SendIcon,
    },
  ];

  return (
    <>
      <div
        className={"p-4 grid grid-cols-4 rounded-3xl bg-white text-gray-500"}
      >
        {Labels?.map((e, key) => {
          const Icon = e?.Icon;
          return (
            <div
              onClick={() => e?.onClick()}
              className={"flex flex-col items-center gap-1"}
            >
              <div
                className={
                  "bg-ash-50 hover:bg-ash-100 cursor-pointer rounded-full p-2 text-xl text-blue-500"
                }
              >
                <Icon />
              </div>
              <span className={"text-xs"}>{e?.title}</span>
            </div>
          );
        })}
      </div>
      {showInvoice && (
        <InvoiceReport order={details} onClose={() => setInvoice(false)} />
      )}
      {showWaybill && (
        <WayBillReport order={details} onClose={() => setWaybill(false)} />
      )}
      {showBoxLabel && (
        <BoxLabelReport order={details} onClose={() => setBoxLabel(false)} />
      )}
      {showAddressLabel && (
        <AddressLabelReport
          order={details}
          onClose={() => setAddressLabel(false)}
        />
      )}
    </>
  );
};
const RatingCard = ({ details }: { details: IOrder }) => {
  const { editHandler } = useContext(RatingContext);
  const { getRatingDetailsHandler, isRatingLoading, ratingDetails } =
    useApiManager();
  useEffect(() => {
    (async () => {
      await getRatingDetailsHandler(details?.activity);
    })();
  }, []);

  const onSubmitHandler = async (values: any) => {
    await editHandler(
      {
        activityID: details?.activity,
        rating: values?.rating,
        reviews: values?.review,
      },
      {
        onSuccess: async () => {
          await getRatingDetailsHandler(details?.activity);
        },
      },
    );
  };
  const { userDetails, isUser } = useAuthorization();
  const isRated = isUser ? ratingDetails?.customer : ratingDetails?.vendor;
  if (isRatingLoading) {
    return <></>;
  }
  if (isRated) {
    return (
      <div className={"flex flex-col gap-2 p-4 bg-white rounded-3xl"}>
        <span className={"text-base font-semibold"}>Your review</span>
        <Rate
          disabled
          value={
            isUser
              ? ratingDetails?.customer?.rating
              : ratingDetails?.vendor?.rating
          }
        />
        <div className={"flex flex-wrap gap-2 gap-y-2"}>
          {[
            ...((isUser
              ? ratingDetails?.customer?.reviews
              : ratingDetails?.vendor?.reviews) || []),
          ]?.map((e, key) => {
            return (
              <div
                className={`text-xs bg-ash-100 px-2 py-1 rounded-full`}
                key={key}
              >
                {e}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className={"p-4 bg-white rounded-3xl"}>
      <div>
        <Formik
          initialValues={{
            rating: 5,
            review: [],
          }}
          onSubmit={onSubmitHandler}
        >
          {({ setFieldValue, values }) => {
            const ratingLabels = (() => {
              return (
                ReviewLabel?.[details?.vendor?.service]?.[
                  userDetails?.userType
                ]?.[values?.rating] || []
              );
            })();

            return (
              <Form className={"flex flex-col gap-2"}>
                <span className={"text-center text-base font-semibold"}>
                  Rate our vendor service
                </span>
                <div className={"flex justify-center"}>
                  <Rate
                    value={values?.rating}
                    onChange={async (val) => {
                      await setFieldValue("rating", val);
                    }}
                  />
                </div>
                {ratingLabels?.length > 0 && (
                  <div className={"flex flex-col gap-2"}>
                    <span>Review</span>
                    <div className={"flex flex-wrap gap-4 gap-y-2"}>
                      {ratingLabels?.map((e, key) => {
                        const isSelected = values?.review?.find(
                          (val) => val == e,
                        );
                        return (
                          <button
                            onClick={async () => {
                              let tempReview = [...values?.review];
                              if (isSelected) {
                                tempReview = tempReview?.filter(
                                  (val) => val !== e,
                                );
                              } else {
                                tempReview.push(e);
                              }
                              await setFieldValue("review", tempReview);
                            }}
                            className={`text-xs ${isSelected ? "bg-black text-white" : "bg-ash-100"}  cursor-pointer px-2 py-1 rounded-full`}
                            key={key}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <MyButton
                  className={"rounded-full"}
                  name={"Submit"}
                  htmlType={"submit"}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
export default ActivityDetailsPage;

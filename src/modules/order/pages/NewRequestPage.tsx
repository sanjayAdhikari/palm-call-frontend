import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  EmptyMessageComponent,
  MyButton,
  MyInput,
  MyModal,
  PageTemplate,
  ViewFile,
} from "components";
import { Form, Formik, useFormikContext } from "formik";
import { OrderFormik } from "../helpers";
import { useAuthorization, useQueryParams, useScreenSize } from "hooks";
import {
  AppIconType,
  IBidding,
  IUserPackageOrderPayload,
  QueryNames,
  UserType,
} from "interfaces";
import {
  ConsigneeForm,
  ManageConsigneeDetails,
  PickupDetailsForm,
  SourceDestinationCountryForm,
} from "../components";
import {
  commaSeparator,
  getAddressHandler,
  getWeightRangeOptions,
} from "utils";
import { useAppContext, OrderContext } from "context";
import { Badge, Rate, Skeleton } from "antd";
import { PageLinks } from "constant";
import { useSearchParams } from "react-router-dom";

function NewRequestPage() {
  const { requestOrderHandler } = useContext(OrderContext);
  const { goToActivityDetails } = useQueryParams();
  const { userDetails } = useAppContext();
  const { currentRole } = useAuthorization();
  const isUser = currentRole === UserType.USER;
  const { isSmScreen } = useScreenSize();
  const [isSearched, setSearched] = useState(false);
  const [query] = useSearchParams();
  const srcCountry: any = query.get(QueryNames.SOURCE);
  const destCountry: any = query.get(QueryNames.DESTINATION);

  const onSubmit = async (values: any) => {
    await requestOrderHandler(values, {
      onSuccess: async (res) => {
        goToActivityDetails(isUser ? res?.activity : res?._id);
      },
    });
  };
  return (
    <PageTemplate backLink={isSmScreen && PageLinks.dashboard.list}>
      <Formik
        enableReinitialize
        initialValues={OrderFormik.initialValues({
          sourceCountry: srcCountry,
          destinationCountry: destCountry,
          shipper: {
            name: userDetails?.name?.first,
            email: userDetails?.email,
          },
        })}
        validationSchema={OrderFormik.validationSchema}
        onSubmit={onSubmit}
      >
        <Form
          className={
            "grid sm:grid-cols-[400px_auto] grid-cols-1 sm:h-full sm:gap-10 gap-5"
          }
        >
          <div className={""}>
            <OrderDetails isSearched={isSearched} setSearch={setSearched} />
          </div>
          {isSearched && (
            <div className={"h-full"}>
              <BiddingList isSearched={isSearched} />
            </div>
          )}
        </Form>
      </Formik>
    </PageTemplate>
  );
}

function BiddingList({ isSearched }: { isSearched?: boolean }) {
  const { values, setFieldValue } =
    useFormikContext<IUserPackageOrderPayload>();
  const { getBiddingHandler, isBiddingLoading, biddingLists } =
    useContext(OrderContext);
  const selectedBid = biddingLists?.find(
    (e) => e?.vendor?._id === values?.vendor,
  );
  useEffect(() => {
    if (isSearched) {
      getBiddingHandler(
        values?.sourceCountry,
        values?.destinationCountry,
        values?.itemsCustomer?.[0]?.weight,
      );
    }
  }, [
    isSearched,
    values?.sourceCountry,
    values?.destinationCountry,
    values?.itemsCustomer?.[0]?.weight,
  ]);

  return (
    <div className={"h-full mb-[100px]"}>
      <div className="flex flex-col gap-2 relative h-full">
        <span className={"font-bold text-2xl"}>Choose Courier Company</span>
        <div className={"flex flex-col gap-2"}>
          {isBiddingLoading ? (
            new Array(5).fill("").map((e, key) => {
              return <VendorCard key={key} isLoading />;
            })
          ) : biddingLists?.length < 1 ? (
            <EmptyMessageComponent message={"No courier company found"} />
          ) : (
            biddingLists?.map((e, key) => (
              <VendorCard
                onClick={async () => {
                  await setFieldValue("vendor", e?.vendor?._id);
                  await setFieldValue(
                    "deliveryType",
                    e?.deliveryOptions.deliveryType._id,
                  );
                }}
                isSelected={
                  e?.vendor?._id === values?.vendor &&
                  e?.deliveryOptions?.deliveryType?._id == values?.deliveryType
                }
                details={e}
                key={key}
              />
            ))
          )}
        </div>
        {selectedBid && (
          <div className="sm:absolute fixed sm:bottom-10 bottom-5 shadow-lg p-5 border border-ash-50 rounded-xl left-5 right-5 bg-white ">
            <span className={"text-xs text-red-500"}>
              *Displayed price is an estimate. Final price will be confirmed
              after vendor approval.
            </span>
            <div className={"flex justify-between  items-center"}>
              <div>
                <div className="text-xl font-bold text-black mt-1">
                  NPR{" "}
                  {commaSeparator(selectedBid?.deliveryOptions?.totalCharge)}
                </div>
              </div>
              <RequestCheckoutModal />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCheckoutModal() {
  const { values, handleSubmit, errors } =
    useFormikContext<IUserPackageOrderPayload>();
  const [openCheckout, setCheckout] = useState(false);
  const [openReceiver, setReceiver] = useState(false);
  const filledReceiverDetails =
    values?.consignee?.name &&
    values?.consignee?.phone &&
    values?.consignee?.address?.postalCode &&
    values?.consignee?.address?.street &&
    values?.consignee?.address?.city;
  const canContinue =
    !errors?.itemsCustomer || errors?.itemsCustomer?.length == 0;
  console.log(errors, canContinue);
  return (
    <>
      <MyButton
        disabled={!canContinue}
        onClick={() =>
          filledReceiverDetails ? setCheckout(true) : setReceiver(true)
        }
        name="Continue"
        color="default"
      />
      {openCheckout && (
        <MyModal title={"Checkout"} onCancel={() => setCheckout(false)}>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex flex-col gap-1"}>
              <span>Receiver / Consignee</span>
              <ManageConsigneeDetails />
            </div>
            <div className={"flex flex-col gap-2"}>
              <span className={"text-lg font-medium"}>Pickup Details</span>
              <MyInput
                isRequired
                name={"shipper.phone"}
                label={"Phone number"}
                placeholder={"Phone number"}
              />{" "}
              <MyInput
                isRequired
                name={"shipper.address"}
                label={"Address"}
                placeholder={"Address"}
              />
              <PickupDetailsForm hidePackageDetails />
            </div>
            <MyButton
              name={"Confirm"}
              onClick={() => handleSubmit()}
              htmlType={"submit"}
            />
          </div>
        </MyModal>
      )}
      {openReceiver && (
        <MyModal title={"Receiver Details"} onCancel={() => setReceiver(false)}>
          <div className={"flex flex-col gap-2"}>
            <ConsigneeForm />
            <MyButton
              disabled={!filledReceiverDetails}
              name={"Continue"}
              htmlType={"button"}
              onClick={() => {
                setReceiver(false);
                setCheckout(true);
              }}
            />
          </div>
        </MyModal>
      )}
    </>
  );
}

function OrderDetails({
  isSearched,
  setSearch,
}: {
  isSearched?: boolean;
  setSearch?: any;
}) {
  const { getBiddingHandler } = useContext(OrderContext);
  const { values } = useFormikContext<IUserPackageOrderPayload>();

  const onSearch = async () => {
    setSearch(true);
    await getBiddingHandler(
      values?.sourceCountry,
      values?.destinationCountry,
      values?.itemsCustomer?.[0]?.weight,
    );
  };
  const canSearch =
    values?.itemsCustomer?.length > 0 &&
    values?.itemsCustomer?.[0]?.description &&
    values?.itemsCustomer?.[0]?.weight;
  return (
    <div className={"flex flex-col gap-4"}>
      {/*  selection of country and weight*/}
      <span className={"font-bold text-xl"}>Get a delivery</span>
      <div className={"flex flex-col gap-2"}>
        <SourceDestinationCountryForm onlyCountry />
        <span className={"font-medium text-sm"}>
          What to deliver <span className={"text-red-500"}>*</span>
        </span>
        <MyInput
          name="itemsCustomer.0.description"
          inputType="text-area"
          placeholder="Contents of Parcel: Clothing, dried meat, and other miscellaneous items."
          isRequired
          options={getWeightRangeOptions()}
        />
        <MyInput
          name="itemsCustomer.0.weight"
          inputType="number"
          label={"Approx. weight K.G."}
          placeholder="Courier approx. weight"
          isRequired
          inputMode={"numeric"}
        />

        {!isSearched && (
          <MyButton
            disabled={!canSearch}
            name="Search"
            onClick={onSearch}
            htmlType={"button"}
            iconType={AppIconType.SEARCH}
          />
        )}
      </div>
    </div>
  );
}

const VendorCard = ({
  details,
  isSelected,
  onClick,
  isLoading,
}: {
  details?: Partial<IBidding>;
  isSelected?: boolean;
  onClick?: any;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div>
        <Skeleton active avatar round />
      </div>
    );
  }
  return (
    <Badge.Ribbon
      placement="start"
      style={{ display: details?.vendor?.isFeatured ? "block" : "none" }}
      text="★ Featured"
      color="#FFD700"
    >
      <div
        onClick={() => onClick()}
        className={`flex sm:flex-row gap-2 flex-col sm:items-end items-start cursor-pointer  justify-between p-4 border-2 ${details?.vendor?.isFeatured ? "pt-8" : ""} ${isSelected ? "  border-black" : "border-ash-50"} rounded-lg`}
      >
        <div className={"flex flex-col items-start"}>
          <div className={"flex items-start gap-2"}>
            <div
              className={"flex items-center justify-center h-[40px] w-[40px]"}
            >
              <ViewFile
                canPreview={false}
                name={[details?.vendor?.logo]}
                className={
                  "flex items-center justify-center max-h-[40px] max-w-[40px] rounded-md"
                }
              />
            </div>
            <div className={"flex flex-col"}>
              <span className={"text-xs text-red-500"}>
                {details?.deliveryOptions?.deliveryType?.name}
              </span>
              <span className={"font-bold text-xl"}>
                {details?.vendor?.legalName || details?.vendor?.name}
              </span>
              <Rate
                className={"text-[12px]"}
                allowHalf
                value={details?.currentAverageRating || 5}
              />
              <div className="text-xs text-gray-500 mt-1">
                {getAddressHandler(details?.vendor?.address)}
              </div>
            </div>
          </div>
        </div>
        <div className={"flex flex-col  whitespace-nowrap"}>
          <span className={"text-ash-500 text-xs"}>Starting from</span>
          <span className={"font-bold text-xl "}>
            NPR. {commaSeparator(details?.deliveryOptions?.totalCharge)}
          </span>
        </div>
      </div>
    </Badge.Ribbon>
  );
};

export default NewRequestPage;

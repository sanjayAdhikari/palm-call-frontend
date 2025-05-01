import {
  AppIconType,
  IActivityTimeline,
  IOrder,
  PackageStatusEnum,
} from "interfaces";
import { useApiManager, useAuthorization } from "hooks";
import * as yup from "yup";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityContext } from "../context";
import { OrderContext } from "context";
import { MyButton, MyFormSubmitButton, MyInput, MyModal } from "components";
import { Alert, Timeline } from "antd";
import { capitalizeFirstLetter, getIconsHandler } from "utils";
import moment from "moment/moment";
import { Form, Formik } from "formik";
import { PickupAgentForm } from "./Forms";
import { getEditableFields } from "../helpers";
import {
  AssignRiderValidationSchema,
  AssignRiderValues,
} from "../formikValues";

const TimelineComponent = ({
  details,
  getDetailsHandler,
  viewableOnly,
}: {
  details: IOrder;
  viewableOnly?: boolean;
  getDetailsHandler?(): Promise<void>;
}) => {
  const timeLine = details?.timeline;
  const LocationIcon = getIconsHandler(AppIconType.LOCATION);
  const { packageNextCTA, getNextPackageCTAHandler } = useApiManager();
  const { isUser } = useAuthorization();
  const { processOrderAction } = useContext(OrderContext);

  const [selectedAction, setSelectedAction] = useState<PackageStatusEnum>();
  const { takeLocationAsInputInTimeline } = getEditableFields(details?.status);

  useEffect(() => {
    (async () => {
      if (!details?._id || viewableOnly) return;
      await getNextPackageCTAHandler(details?._id);
    })();
  }, [details?._id, viewableOnly]);
  const onActionClick = async (status: PackageStatusEnum) => {
    setSelectedAction(status);
  };

  const ctaDetails = useMemo(() => {
    if (!selectedAction) return;
    return packageNextCTA?.find((e) => e?.status === selectedAction);
  }, [selectedAction]);
  const onConfirm = async (values: any) => {
    await processOrderAction(
      details?._id,
      values?.status,
      {
        ...values,
      },
      {
        onSuccess: async () => {
          await getDetailsHandler();
          setSelectedAction(null);
        },
      },
    );
  };
  return (
    <div className={"flex flex-col gap-2  bg-white w-full rounded-3xl p-4 "}>
      <span className={"text-base font-semibold text-black"}>Timeline</span>
      <div className={"w-full flex gap-3 flex-wrap"}>
        {packageNextCTA?.map((e, key) => {
          const isCancelType =
            e?.label.toLowerCase().includes("cancel") ||
            e?.label.toLowerCase().includes("reject");
          return (
            <MyButton
              onClick={() => onActionClick(e?.status)}
              key={key}
              className={"rounded-full"}
              size={"middle"}
              variant={isCancelType ? "filled" : key == 0 ? "solid" : "filled"}
              name={e?.label}
            />
          );
        })}
      </div>
      <div className={" pt-2 px-2"}>
        <Timeline
          reverse
          mode={"left"}
          items={timeLine?.map((e) => {
            return {
              color: "green",
              children: (
                <div className={"flex flex-col gap-1"}>
                  <div className={"flex items-center gap-2"}>
                    <span className={"text-black"}>
                      {capitalizeFirstLetter(e?.status)}
                    </span>
                    {!isUser && (
                      <EditTimeLineModal
                        orderDetails={details}
                        timelineDetails={e}
                        getDetailsHandler={getDetailsHandler}
                      />
                    )}
                  </div>

                  <div className={"text-sm flex flex-col"}>
                    <span className={"text-xs"}>
                      {moment(e?.timelineDate || e?.actionAt).format(
                        "YYYY-MM-DD",
                      )}
                    </span>
                    {e?.location && (
                      <div className={"flex items-center text-xs"}>
                        <LocationIcon />
                        <span className={"text-xs"}>{e?.location}</span>
                      </div>
                    )}
                    <span className={"text-sm text-ash-500"}>{e?.remarks}</span>
                  </div>
                </div>
              ),
            };
          })}
        />
      </div>
      {selectedAction && (
        <MyModal
          title={ctaDetails?.label}
          onCancel={() => setSelectedAction(null)}
        >
          <Formik
            enableReinitialize
            initialValues={{
              status: selectedAction,
              location: "",
              remarks: "",
              ...(selectedAction === PackageStatusEnum.SHIPMENT_PICKUP_ASSIGN
                ? AssignRiderValues(details?.pickupAgent)
                : {}),
            }}
            validationSchema={
              selectedAction === PackageStatusEnum.SHIPMENT_PICKUP_ASSIGN
                ? AssignRiderValidationSchema
                : undefined
            }
            onSubmit={onConfirm}
          >
            <Form className={"flex flex-col gap-2"}>
              <Alert
                showIcon
                type={"info"}
                description={ctaDetails?.description}
              />
              {selectedAction === PackageStatusEnum.SHIPMENT_PICKUP_ASSIGN ? (
                <PickupAgentForm />
              ) : (
                <>
                  {takeLocationAsInputInTimeline && (
                    <MyInput
                      placeholder={"Enter location"}
                      name={"location"}
                      label={"Location"}
                    />
                  )}
                  <MyInput
                    placeholder={"Enter remarks"}
                    name={"remarks"}
                    label={"Remarks"}
                    inputType={"text-area"}
                  />
                </>
              )}

              <MyButton block name={"Confirm"} htmlType={"submit"} />
            </Form>
          </Formik>
        </MyModal>
      )}
    </div>
  );
};

const EditTimeLineModal = ({
  timelineDetails,
  orderDetails,
  getDetailsHandler,
}: {
  orderDetails?: Partial<IOrder>;
  timelineDetails: IActivityTimeline;
  getDetailsHandler?: any;
}) => {
  const [isOpen, setOpen] = useState(false);
  const EditIcon = getIconsHandler(AppIconType.EDIT);
  const { editTimelineHandler } = useContext(ActivityContext);
  const onSubmit = async (values: any) => {
    await editTimelineHandler(orderDetails?._id, timelineDetails?._id, values, {
      onSuccess: async () => {
        getDetailsHandler();
      },
    });
  };
  return (
    <>
      <EditIcon className={"cursor-pointer"} onClick={() => setOpen(true)} />
      {isOpen && (
        <MyModal title={"Edit Timeline"} onCancel={() => setOpen(false)}>
          <Formik
            initialValues={{
              remarks: timelineDetails?.remarks,
              location: timelineDetails?.location,
              timelineDate:
                timelineDetails?.timelineDate ||
                timelineDetails?.actionAt ||
                new Date(),
            }}
            validationSchema={yup.object().shape({
              timelineDate: yup.string().required(" "),
            })}
            onSubmit={onSubmit}
          >
            <Form className={"flex flex-col gap-2"}>
              <MyInput
                isRequired
                inputType={"date"}
                label={"Timeline Date"}
                name={"timelineDate"}
              />
              <MyInput
                placeholder={"Enter location"}
                label={"Location"}
                name={"location"}
              />{" "}
              <MyInput
                placeholder={"Enter remarks"}
                label={"Remarks"}
                name={"remarks"}
              />
              <MyFormSubmitButton />
            </Form>
          </Formik>
        </MyModal>
      )}
    </>
  );
};
export default TimelineComponent;

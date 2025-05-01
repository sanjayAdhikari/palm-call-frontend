import React, { useContext, useEffect } from "react";
import {
  EmptyMessageComponent,
  MyFormSubmitButton,
  MyInput,
  PageTemplate,
  KYCDetails,
} from "components";
import { PageLinks } from "constant";
import { KycContext } from "context";
import {
  AppIconType,
  KycStatusEnum,
  ParamsNames,
  QueryNames,
} from "interfaces";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useScreenSize } from "hooks";
import {
  capitalizeFirstLetter,
  getIconsHandler,
  getKycStatusOptions,
} from "utils";
import { KYC_MESSAGE } from "../helpers";
import { Form, Formik } from "formik";
import moment from "moment";
import { Skeleton } from "antd";

function KYCDetailsPage() {
  const { getDetailsHandler, isDetailsLoading, details, updateKYCStatus } =
    useContext(KycContext);
  const { isSmScreen } = useScreenSize();
  const navigate = useNavigate();
  const BackIcon = getIconsHandler(AppIconType.BACK);
  const params = useParams<ParamsNames>();
  const [query] = useSearchParams();
  const Id = params.ID || query.get(QueryNames.ID);
  useEffect(() => {
    (async () => {
      if (!Id) return;
      await getDetailsHandler(Id);
    })();
  }, [Id]);
  const StatusDetails = KYC_MESSAGE?.[details?.status];
  const onUpdateStatusHandler = async (values: any) => {
    await updateKYCStatus(values, {
      onSuccess: async () => {
        await getDetailsHandler(Id);
      },
    });
  };
  return (
    <PageTemplate
      title={"KYC Information"}
      backLink={isSmScreen && PageLinks.kyc.list}
    >
      <div className={" h-full overflow-y-scroll"}>
        {isDetailsLoading ? (
          <Skeleton active round paragraph className={"mt-4"} />
        ) : !details ? (
          <EmptyMessageComponent message={"Something went wrong"} />
        ) : (
          <div className={"flex flex-col gap-5"}>
            <div className={"flex items-start"}>
              <div
                className={"text-white text-sm p-1 px-2 rounded-md"}
                style={{
                  backgroundColor: StatusDetails?.color,
                }}
              >
                {capitalizeFirstLetter(details?.status)}
              </div>
            </div>

            <KYCDetails details={details} />
            <div className={"flex flex-col gap-4 p-3 rounded-md border"}>
              <span className={"font-bold"}>Actions</span>
              {details?.adminActionAt && (
                <div className={"flex flex-col gap-1 text-sm"}>
                  <span>
                    Action at:{" "}
                    {moment(details?.adminActionAt).format("YYYY-MM-DD")}
                  </span>{" "}
                  <span>Remarks: {details?.adminRemarks}</span>
                </div>
              )}
              {details?.status !== KycStatusEnum.VERIFIED && (
                <Formik
                  enableReinitialize
                  initialValues={{
                    action: KycStatusEnum.VERIFIED,
                    remarks: "",
                    _id: details?.customer,
                  }}
                  onSubmit={onUpdateStatusHandler}
                >
                  <Form className={"flex flex-col gap-2"}>
                    <MyInput
                      label={"Status"}
                      name={"action"}
                      options={getKycStatusOptions()}
                      isRequired
                      placeholder={"Select status"}
                      inputType={"select"}
                    />
                    <MyInput
                      label={"Remarks"}
                      name={"remarks"}
                      inputType={"text-area"}
                      placeholder={"Enter remarks"}
                    />
                    <MyFormSubmitButton />
                  </Form>
                </Formik>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

export default KYCDetailsPage;

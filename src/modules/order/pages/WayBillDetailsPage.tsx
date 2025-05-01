import React, { useContext, useEffect } from "react";
import {
  EmptyMessageComponent,
  LoadingAnimation,
  MyButton,
  MyInput,
  PageTemplate,
} from "components";
import { OrderContext } from "context";
import { AppIconType, QueryNames } from "interfaces";
import { Form, Formik } from "formik";
import { TimelineComponent } from "../components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLinks } from "constant";

function WaybillDetailsPage() {
  const { isWaybillDetailsLoading, waybillDetails, getWaybillDetails } =
    useContext(OrderContext);
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const waybill = query.get(QueryNames.ID);
  const onSubmit = async (values: any) => {
    if (!values?.waybill) return;
    await getWaybillDetails(values?.waybill);
  };
  useEffect(() => {
    if (!waybill) return;
    getWaybillDetails(waybill);
  }, [waybill]);
  return (
    <PageTemplate title={"Track your shipment"} backLink={PageLinks.auth.login}>
      <div className={"flex flex-col gap-5 bg-bgSecondary h-full "}>
        <div className={"flex justify-center bg-white pb-5 border-t"}>
          <div
            className={"flex flex-col gap-4 items-center sm:w-[500px] w-full"}
          >
            <div className={"text-center "}>
              <span className={"font-bold text-xl"}></span>
            </div>
            <Formik
              enableReinitialize
              initialValues={{ waybill: waybill }}
              onSubmit={onSubmit}
            >
              <Form
                className={
                  "grid grid-cols-[auto_40px] items-center gap-2 w-full"
                }
              >
                <MyInput
                  name={"waybill"}
                  placeholder={"Enter waybill number"}
                />
                <MyButton
                  color={"blue"}
                  htmlType={"submit"}
                  iconType={AppIconType.SEARCH}
                />
              </Form>
            </Formik>
          </div>
        </div>
        {isWaybillDetailsLoading ? (
          <LoadingAnimation />
        ) : !waybillDetails ? (
          <EmptyMessageComponent message={"No data found"} />
        ) : (
          <div className={"grid gap-2 sm:px-10 px-2"}>
            {/*<div className={"flex flex-col gap-2"}>*/}
            {/*  <EntityDetailsComponent viewable details={waybillDetails} />*/}
            {/*  <MyButton*/}
            {/*    variant={"solid"}*/}
            {/*    block={true}*/}
            {/*    onClick={() => navigate(PageLinks.activity.waybillDetails)}*/}
            {/*    iconType={AppIconType.LOGOUT}*/}
            {/*    name={"Login to view more details"}*/}
            {/*  />*/}
            {/*</div>*/}

            <div className={"flex flex-col gap-2"}>
              <TimelineComponent details={waybillDetails} viewableOnly />
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

export default WaybillDetailsPage;

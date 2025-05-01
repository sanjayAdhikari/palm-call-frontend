import React, { useContext } from "react";
import { MyButton, MyInput, PageTemplate } from "components";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { UtilityContext } from "context";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "constant";
import ReferralImage from "assets/referral.png";

function ApplyReferralsPage() {
  const { applyReferralHandler } = useContext(UtilityContext);
  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    await applyReferralHandler(values?.code, {
      onSuccess: async () => {
        navigate(PageLinks.dashboard.list);
      },
    });
  };
  return (
    <PageTemplate backLink={PageLinks.dashboard.list} title={"Apply Referral"}>
      <div className={"flex items-start justify-center h-full"}>
        <Formik
          initialValues={{
            code: "",
          }}
          validationSchema={yup.object().shape({
            code: yup.string().required(" "),
          })}
          onSubmit={onSubmit}
        >
          <Form className={"flex flex-col gap-3 p-5 w-[500px]  rounded-md"}>
            <div className={"flex flex-col gap-2 items-center text-center"}>
              <img
                src={ReferralImage}
                alt={"referral"}
                className={"h-[250px]"}
              />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Enter Referral Code
              </h1>
              <p className="text-gray-600 mb-4">
                Enter your friend's referral code to receive exclusive rewards!
              </p>
            </div>
            <MyInput
              autoFocus
              name={"code"}
              placeholder={"Referral Code"}
              isRequired
            />
            <div className={"flex flex-col gap-1"}>
              <MyButton htmlType={"submit"} name={"Apply"} />
              <MyButton
                htmlType={"button"}
                onClick={() => {
                  navigate(PageLinks.dashboard.list);
                }}
                name={"Skip"}
                variant={"text"}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </PageTemplate>
  );
}

export default ApplyReferralsPage;

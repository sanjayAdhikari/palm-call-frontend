import React from "react";
import { Form, Formik } from "formik";
import { MyButton } from "components";
import { SourceDestinationCountryForm } from "../../order/components";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "constant";
import { QueryNames } from "interfaces";

function FindRateComponent() {
  const navigate = useNavigate();
  const onSubmit = (values: any) => {
    navigate({
      pathname: PageLinks.shipmentRequest.create,
      search: `${QueryNames.DESTINATION}=${values?.destinationCountry}&${QueryNames.SOURCE}=${values?.sourceCountry}`,
    });
  };
  return (
    <Formik
      initialValues={{
        destinationCountry: "",
        sourceCountry: "",
      }}
      onSubmit={onSubmit}
    >
      <Form className={"flex flex-col gap-5 "}>
        <span className={"font-bold text-2xl"}>
          Get ready for your first order
        </span>
        <div className={"flex flex-col gap-3"}>
          <SourceDestinationCountryForm onlyCountry />
          <div>
            <MyButton htmlType={"submit"} name={"Continue"} />
          </div>
        </div>
      </Form>
    </Formik>
  );
}

export default FindRateComponent;

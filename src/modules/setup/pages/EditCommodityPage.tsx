import React, { useContext, useEffect } from "react";
import { MyFormSubmitButton, MyInput, PageTemplate } from "components";
import { PageLinks } from "constant";
import { CommodityContext } from "../context";
import { useQueryParams } from "hooks";
import { Form, Formik } from "formik";
import { CommodityFormik } from "../helpers";
import { useNavigate } from "react-router-dom";

function EditCommodityPage() {
  const { editId, getResponsiveBackLink } = useQueryParams();
  const navigate = useNavigate();
  const { editHandler, details, getDetailsHandler } =
    useContext(CommodityContext);

  useEffect(() => {
    (async () => {
      if (editId) {
        await getDetailsHandler(editId);
      }
    })();
  }, [editId]);
  const onSubmit = async (values: any) => {
    await editHandler(values, {
      onSuccess: async () => {
        navigate(PageLinks.commodity.list);
      },
    });
  };
  return (
    <PageTemplate
      backLink={getResponsiveBackLink()}
      title={editId ? "Edit Commodity" : "Create Commodity"}
    >
      <Formik
        enableReinitialize
        initialValues={CommodityFormik.initialValue(editId ? details : {})}
        validationSchema={CommodityFormik.validationSchema}
        onSubmit={onSubmit}
      >
        {({ values }) => {
          return (
            <Form className={"flex flex-col gap-5"}>
              <MyInput
                label={"Name"}
                name={"name"}
                isRequired
                placeholder={"eg: Premium"}
              />
              <MyInput
                label={"Description"}
                name={"description"}
                isRequired
                inputType={"text-area"}
                placeholder={"Write about delivery type"}
              />{" "}
              <MyInput
                label={"Fragile?"}
                name={"isFragile"}
                isRequired
                inputType={"checkbox"}
              />
              <MyFormSubmitButton />
            </Form>
          );
        }}
      </Formik>
    </PageTemplate>
  );
}

export default EditCommodityPage;

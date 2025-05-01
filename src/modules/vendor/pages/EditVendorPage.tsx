import React, { useContext, useEffect } from "react";
import { MyFormSubmitButton, PageTemplate } from "components";
import { PageLinks } from "constant";
import { VendorContext } from "context";
import { useQueryParams } from "hooks";
import { Form, Formik } from "formik";
import { VendorFormik } from "../helpers";
import { useNavigate } from "react-router-dom";
import { EditVendorForm } from "../components";

function EditVendorPage() {
  const { editId } = useQueryParams();
  const navigate = useNavigate();
  const { editHandler, details, getDetailsHandler } = useContext(VendorContext);

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
        navigate(PageLinks.vendor.list);
      },
    });
  };
  return (
    <PageTemplate
      backLink={PageLinks.vendor.list}
      title={editId ? "Edit Vendor" : "Create Vendor"}
    >
      <Formik
        enableReinitialize
        initialValues={VendorFormik.initialValue(editId ? details : {})}
        validationSchema={VendorFormik.validationSchema}
        onSubmit={onSubmit}
      >
        <Form className={"flex flex-col gap-5"}>
          <EditVendorForm />
          <MyFormSubmitButton />
        </Form>
      </Formik>
    </PageTemplate>
  );
}

export default EditVendorPage;

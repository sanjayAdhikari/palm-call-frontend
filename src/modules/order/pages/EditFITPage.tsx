import React, { useContext, useEffect } from "react";
import { PageTemplate } from "components";
import { PageLinks } from "constant";
import { Form, Formik } from "formik";
import { FITFormik, getEditableFields } from "../helpers";

import { FITOrderForm } from "../components";
import { IOrder, ParamsNames } from "interfaces";
import { useQueryParams } from "hooks";
import { useParams } from "react-router-dom";
import { useAppContext, OrderContext } from "context";

function EditFITPage() {
  const { createFITOrderHandler, getDetailsHandler, details, editHandler } =
    useContext(OrderContext);
  const { goToActivityDetails } = useQueryParams();
  const {
    handler: { setLoading },
  } = useAppContext();
  const params = useParams<ParamsNames>();
  const ID = params?.ID;
  const onSubmit = async (values: Partial<IOrder>) => {
    try {
      if (values?._id) {
        await editHandler(values, {
          onSuccess: async (res) => {
            goToActivityDetails(res?._id);
          },
        });
      } else {
        await createFITOrderHandler(values, {
          onSuccess: async (res) => {
            goToActivityDetails(res?._id);
          },
        });
      }
    } catch (err) {
      console.log(err, "error");
    }
  };
  useEffect(() => {
    (async () => {
      if (!ID) return;
      setLoading(true);
      await getDetailsHandler(ID);
      setLoading(false);
    })();
  }, [ID]);
  return (
    <PageTemplate
      transparentPage
      backLink={PageLinks.dashboard.list}
      title={ID ? "Edit Order" : "Create FIT"}
    >
      <Formik
        enableReinitialize
        initialValues={FITFormik.initialValues(details)}
        validationSchema={FITFormik.validationSchema}
        onSubmit={onSubmit}
      >
        <Form className={"flex flex-col gap-5 h-full w-full "}>
          <FITOrderForm />
        </Form>
      </Formik>
    </PageTemplate>
  );
}

export default EditFITPage;

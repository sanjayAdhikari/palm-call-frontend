import React, { useContext } from "react";
import { PageTemplate } from "components";
import { PageLinks } from "constant";
import { CourierRateContext } from "../context";
import { Form, Formik, FormikHelpers } from "formik";
import { CourierRateFormik, mapPayloadToCourierRates } from "../helpers";
import { EditCourierRateForm } from "../components";
import { ICourierRateForm } from "../interface";
import { useAuthorization } from "hooks";

function EditCourierRatePage() {
  const { editHandler, getListHandler } = useContext(CourierRateContext);
  const { currentVendorId } = useAuthorization();
  const onSubmit = async (
    values: ICourierRateForm,
    helpers: FormikHelpers<any>,
  ) => {
    try {
      const payload = mapPayloadToCourierRates(values);
      await CourierRateFormik.validationSchema.validate(payload, {
        abortEarly: false,
      });

      await editHandler(payload, {
        onSuccess: async () => {
          await getListHandler({
            vendor: values?.vendor,
          });
        },
      });
    } catch (err) {
      err.inner.forEach((e: any) => {
        const selectedCountryIndex = values?.selectedCountryIndex;
        const selectedDeliveryIndex = values?.selectedDeliveryIndex;
        const fieldPathMap = {
          vendor: `vendor`,
          destinationCountry: `country.${selectedCountryIndex}.destinationCountry`,
          sourceCountry: `country.${selectedCountryIndex}.sourceCountry`,
          deliveryType: `country.${selectedCountryIndex}.delivery.${selectedDeliveryIndex}.deliveryType`,
          baseChargeCommission: `country.${selectedCountryIndex}.delivery.${selectedDeliveryIndex}.baseChargeCommission`,
          baseCharge: `country.${selectedCountryIndex}.delivery.${selectedDeliveryIndex}.baseCharge`,
        };

        // Check if the error path is in the map, otherwise handle `rateSlab`
        const fieldPath =
          fieldPathMap[e?.path] ??
          (e?.path?.startsWith("rateSlab")
            ? `country.${selectedCountryIndex}.delivery.${selectedDeliveryIndex}.${e?.path}`
            : null);

        if (fieldPath) {
          helpers?.setFieldError(fieldPath, e?.message);
        } else {
          console.warn("Error on courier rate form", e?.path, e?.message);
        }
      });
    }
  };
  return (
    <PageTemplate
      backLink={PageLinks.dashboard.more}
      title={"Manage Courier Rate"}
    >
      <Formik
        enableReinitialize
        initialValues={CourierRateFormik.initialValues({
          vendor: currentVendorId,
        })}
        onSubmit={onSubmit}
      >
        <Form className={"h-full overflow-y-scroll hide-scrollbar"}>
          <EditCourierRateForm />
        </Form>
      </Formik>
    </PageTemplate>
  );
}

export default EditCourierRatePage;

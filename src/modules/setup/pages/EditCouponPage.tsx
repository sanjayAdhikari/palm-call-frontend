import React, { useContext, useEffect } from "react";
import { MyFormSubmitButton, MyInput, PageTemplate } from "components";
import { PageLinks } from "constant";
import { CouponContext } from "../context";
import { useQueryParams } from "hooks";
import { Form, Formik } from "formik";
import { CouponFormik } from "../helpers";
import { useNavigate } from "react-router-dom";
import { OptionContext } from "context";
import { getVendorOptions } from "utils";
import { CouponDiscountTypeEnum, ServiceEnum } from "interfaces";

function EditCouponPage() {
  const { editId } = useQueryParams();
  const navigate = useNavigate();
  const { editHandler, details, getDetailsHandler } = useContext(CouponContext);
  const {
    options: { vendors },
  } = useContext(OptionContext);
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
        navigate(PageLinks.coupon.list);
      },
    });
  };

  return (
    <PageTemplate
      backLink={PageLinks.coupon.list}
      title={editId ? "Edit Coupon" : "Create Coupon"}
    >
      <Formik
        enableReinitialize
        initialValues={CouponFormik.initialValue(editId ? details : {})}
        validationSchema={CouponFormik.validationSchema}
        onSubmit={onSubmit}
      >
        {({ values }) => {
          return (
            <Form className={"flex flex-col gap-5"}>
              <div className={"grid grid-cols-2 gap-5"}>
                <MyInput
                  label={"Title"}
                  name={"title"}
                  isRequired
                  placeholder={"Enter title"}
                />
                <MyInput
                  label={"Promo Code"}
                  name={"code"}
                  isRequired
                  placeholder={"Enter promo code"}
                />
              </div>
              <MyInput
                label={"Service"}
                name={"service"}
                isRequired
                inputType={"select"}
                options={[
                  {
                    label: "Hyre-cargo",
                    value: ServiceEnum.HYRE_CARGO,
                  },
                  {
                    label: "Hyre",
                    value: ServiceEnum.HYRE,
                  },
                ]}
                placeholder={"Select service"}
              />
              <div className={"flex items-center gap-5"}>
                <MyInput
                  label={"Apply to all vendors under this service"}
                  name={"forAllVendorUnderService"}
                  inputType={"checkbox"}
                />{" "}
                <MyInput
                  label={"Vendor is liable to burn the cash"}
                  name={"discountFromVendor"}
                  inputType={"checkbox"}
                />
              </div>
              {!values?.forAllVendorUnderService && (
                <MyInput
                  label={"Vendor"}
                  name={"vendor"}
                  isRequired
                  options={getVendorOptions(vendors)}
                  inputType={"select"}
                  placeholder={"Select vendor(s)"}
                />
              )}
              <div className={"grid grid-cols-2 gap-5"}>
                <MyInput
                  label={"Valid From"}
                  name={"validFrom"}
                  isRequired
                  minDate={new Date().toDateString()}
                  inputType={"date"}
                  placeholder={"Select start date"}
                />{" "}
                <MyInput
                  label={"Valid Until"}
                  name={"validUntil"}
                  minDate={new Date().toDateString()}
                  isRequired
                  inputType={"date"}
                  placeholder={"Select end date"}
                />{" "}
              </div>
              <div className={"grid grid-cols-4 gap-5"}>
                <MyInput
                  label={"Total Quantity"}
                  name={"totalQuantity"}
                  isRequired
                  inputType={"number"}
                  placeholder={"Enter total available quantity"}
                />
                <MyInput
                  label={"Discount Type"}
                  name={"discountType"}
                  radioOptions={[
                    {
                      label: "Flat",
                      value: CouponDiscountTypeEnum.FLAT,
                    },
                    {
                      label: "Percentage",
                      value: CouponDiscountTypeEnum.PERCENTAGE,
                    },
                  ]}
                  inputType={"radio"}
                />

                <MyInput
                  label="Discount"
                  name="discount"
                  inputType="number"
                  isRequired
                  placeholder="Enter discount amount"
                  disabled={!values?.discountType}
                  addonAfter={
                    values?.discountType === CouponDiscountTypeEnum.PERCENTAGE
                      ? "%"
                      : values?.discountType === CouponDiscountTypeEnum.FLAT
                        ? "Rs."
                        : ""
                  }
                />

                <MyInput
                  label={"Per Customer Usage Limit"}
                  name={"perCustomerUsage"}
                  isRequired
                  inputType={"number"}
                  placeholder={"Enter usage limit per customer"}
                />
              </div>
              <MyInput
                label={"Applicable to first order only"}
                name={"condition.onlyOnFirstOrder"}
                inputType={"checkbox"}
              />
              <div className={"grid grid-cols-2 gap-5"}>
                <MyInput
                  name={"condition.minimumSpendCondition"}
                  label={"Minimum Spend Condition"}
                  placeholder={"Enter minimum spend condition"}
                  isRequired
                  inputType={"number"}
                />
              </div>
              <MyFormSubmitButton />
            </Form>
          );
        }}
      </Formik>
    </PageTemplate>
  );
}

export default EditCouponPage;

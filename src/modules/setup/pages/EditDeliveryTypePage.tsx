import React, { useContext, useEffect } from "react";
import {
  MyButton,
  MyFormSubmitButton,
  MyInput,
  PageTemplate,
} from "components";
import { PageLinks } from "constant";
import { DeliveryTypeContext } from "../context";
import { useQueryParams } from "hooks";
import { FieldArray, Form, Formik } from "formik";
import { DeliveryTypeFormik } from "../helpers";
import { AppIconType } from "interfaces";
import { useNavigate } from "react-router-dom";

function EditDeliveryTypePage() {
  const { editId } = useQueryParams();
  const navigate = useNavigate();
  const { editHandler, details, getDetailsHandler } =
    useContext(DeliveryTypeContext);

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
        navigate(PageLinks.deliveryType.list);
      },
    });
  };
  return (
    <PageTemplate
      breadcrumb={[
        {
          path: PageLinks.dashboard.list,
          name: "Home",
        },
        {
          path: PageLinks.deliveryType.list,
          name: "Delivery Type",
        },
      ]}
      backLink={PageLinks.deliveryType.list}
      title={editId ? "Edit Delivery Type" : "Create Delivery Type"}
    >
      <Formik
        enableReinitialize
        initialValues={DeliveryTypeFormik.initialValue(editId ? details : {})}
        validationSchema={DeliveryTypeFormik.validationSchema}
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
              />
              {/*  TODO: icon*/}
              <div className={"flex flex-col gap-2"}>
                <span>Benefits</span>
                <FieldArray
                  render={({ insert, remove }) => {
                    return (
                      <div className={"flex flex-col gap-1"}>
                        {values?.benefits?.map((e, key) => {
                          return (
                            <div
                              key={key}
                              className={"grid grid-cols-[auto_100px] gap-4"}
                            >
                              <div className={"flex items-center gap-2 w-full"}>
                                <span>{key + 1}.</span>
                                <div className={"w-full"}>
                                  <MyInput
                                    placeholder={"eg: Fast service"}
                                    name={`benefits.${key}`}
                                  />
                                </div>
                              </div>

                              <div className={"flex items-center gap-2"}>
                                <MyButton
                                  onClick={() => insert(key + 1, "")}
                                  type={"text"}
                                  variant={"outlined"}
                                  iconType={AppIconType.ADD}
                                />
                                {key !== 0 && (
                                  <MyButton
                                    onClick={() => remove(key)}
                                    type={"text"}
                                    variant={"outlined"}
                                    color={"danger"}
                                    iconType={AppIconType.DELETE}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }}
                  name={"benefits"}
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

export default EditDeliveryTypePage;

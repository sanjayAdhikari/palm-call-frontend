import React, { useState } from "react";
import { Form, Formik } from "formik";
import moment from "moment";
import { Popover } from "antd";
import { MyButton, MyInput } from "components";
import { AppIconType, QueryNames } from "interfaces";
import { useSearchParams } from "react-router-dom";
import { useQueryParams } from "hooks";
import * as yup from "yup";

interface IFilterValues {
  from: string;
  to: string;
}
interface IFilter {
  onSubmitCB?: (query?: IFilterValues) => void;
}
function FilterComponent({ onSubmitCB }: IFilter) {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useSearchParams();
  const { from, to } = useQueryParams();
  const onSubmit = (values: IFilterValues) => {
    setOpen(false);
    query.set(QueryNames.FROM, values?.from);
    query.set(QueryNames.TO, values?.to);
    setQuery(query);
    typeof onSubmitCB == "function" && onSubmitCB(values);
  };

  const getDateRange = (day: number) => {
    return {
      to: moment().format("YYYY-MM-DD"),
      from: moment().subtract(day, "days").format("YYYY-MM-DD"),
    };
  };

  const Dates = [
    {
      name: "7 days",
      value: getDateRange(7),
    },
    {
      name: "14 days",
      value: getDateRange(14),
    },
    {
      name: "30 days",
      value: getDateRange(30),
    },
  ];
  const ValidationSchema = yup.object().shape({
    from: yup.string().required(" "),
    to: yup
      .string()
      .test(
        "is-after-from",
        "To date must be after From date",
        function (toValue) {
          const { from } = this.parent;
          if (from && toValue) {
            return new Date(toValue) >= new Date(from);
          }
          return true; // if either is missing, don't block
        },
      )
      .required(" "),
  });
  return (
    <Formik
      validationSchema={ValidationSchema}
      enableReinitialize
      onSubmit={onSubmit}
      initialValues={{ from, to }}
    >
      {({ values, submitForm, setFieldValue }) => {
        return (
          <Form className={"flex items-center gap-2"}>
            <div className={"flex items-center gap-2"}>
              {Dates?.map((date, key) => {
                const isSelected =
                  date?.value?.from === values?.from &&
                  date?.value?.to === values?.to;
                return (
                  <button
                    onClick={async () => {
                      await setFieldValue("from", date?.value?.from);
                      await setFieldValue("to", date?.value?.to);
                      await submitForm();
                    }}
                    key={key}
                    className={`p-2 rounded-md text-xs ${isSelected ? "bg-success text-white" : "bg-ash-100 text-black"}`}
                  >
                    {date?.name}
                  </button>
                );
              })}
            </div>
            <Popover
              placement={"bottom"}
              open={isOpen}
              content={
                <div className={"flex flex-col gap-2 min-w-[200px]"}>
                  <MyInput
                    inputSize={"middle"}
                    name={"from"}
                    isRequired
                    label={"From"}
                    inputType={"date"}
                  />
                  <MyInput
                    inputSize={"middle"}
                    name={"to"}
                    isRequired
                    label={"To"}
                    inputType={"date"}
                  />
                  <MyButton
                    size={"middle"}
                    onClick={async (e) => {
                      e?.stopPropagation();
                      await submitForm();
                    }}
                    name={"Filter"}
                  />
                </div>
              }
            >
              <div>
                <MyButton
                  onClick={() => setOpen((e) => !e)}
                  size={"middle"}
                  variant={"outlined"}
                  iconType={AppIconType.FILTER}
                />
              </div>
            </Popover>
          </Form>
        );
      }}
    </Formik>
  );
}

export default FilterComponent;

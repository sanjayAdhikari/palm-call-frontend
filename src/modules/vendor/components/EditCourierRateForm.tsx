import React, { useContext, useEffect, useMemo, useState } from "react";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import {
  MyButton,
  MyFormSubmitButton,
  MyInput,
  MyModal,
  MyMoreOption,
  MyTab,
  MyTable,
} from "components";
import {
  ICountryShippingRateForm,
  ICourierDeliveryRateForm,
  ICourierRateForm,
} from "../interface";
import { OptionContext } from "context";
import {
  capitalizeFirstLetter,
  getCountryOptions,
  getDeliveryTypeOptions,
  getIconsHandler,
  getVendorOptions,
} from "utils";
import { CourierRateContext } from "../context";
import { CourierRateFormik, mapCourierRatesToPayload } from "../helpers";
import {
  AppIconType,
  CourierRateType,
  ICourierRateCharge,
  ITableColumns,
} from "interfaces";
import * as yup from "yup";
import { useAuthorization } from "hooks";

function EditCourierRateForm() {
  const { values, setFieldValue } = useFormikContext<ICourierRateForm>();
  const { isVendor } = useAuthorization();
  const selectedCountryIndex = values?.selectedCountryIndex;
  const selectedDeliveryIndex = values?.selectedDeliveryIndex;

  const setDeliveryIndex = async (index: string) => {
    await setFieldValue("selectedDeliveryIndex", index);
  };
  const setCountryIndex = async (index: string) => {
    await setFieldValue("selectedCountryIndex", index);
  };

  const {
    options: { vendors },
  } = useContext(OptionContext);
  const { getListHandler, lists, isLoading } = useContext(CourierRateContext);

  useEffect(() => {
    (async () => {
      if (!values?.vendor) return;
      await getListHandler({ vendor: values?.vendor });
    })();
  }, [values?.vendor]);
  useEffect(() => {
    (async () => {
      if (!values?.vendor || isLoading || !lists || lists?.docs?.length < 1) {
        await setFieldValue("country", []);
        await setDeliveryIndex("");
        await setCountryIndex("");
        return;
      }
      const courierRateCountry = mapCourierRatesToPayload(lists?.docs);
      await setFieldValue("country", courierRateCountry);
      await setCountryIndex("0");
    })();
  }, [lists, values?.vendor, isLoading]);

  const countryList = useMemo(() => {
    return values?.country || [];
  }, [values?.country]);

  const selectedCountryDetails = useMemo(() => {
    return countryList?.[selectedCountryIndex] as ICountryShippingRateForm;
  }, [selectedCountryIndex, countryList]);

  const onCreateNewCountry = async () => {
    const newCountry = [
      ...values?.country,
      CourierRateFormik?.countryShippingValues({
        isNew: true,
      }),
    ];

    await setFieldValue("country", newCountry);
  };

  const onDeleteCountry = async (index: number) => {
    let tempValues = [...values?.country];
    tempValues.splice(index, 1);
    await setFieldValue("country", tempValues);

    if (selectedCountryIndex == String(index)) {
      await setCountryIndex("");
    }
  };

  const selectableCountry = () => {
    const countries = getCountryOptions();
    return countries?.filter((e) => {
      const selectedCountry = values?.country?.[
        selectedCountryIndex
      ] as ICountryShippingRateForm;
      if (selectedCountry?.destinationCountry == e?.value) {
        return true;
      }
      return !values?.country?.some((value) => {
        // if (String(countryIndex) == String(selectedCountryIndex)) return false;
        return value?.destinationCountry === e?.value;
      });
    });
  };
  const RemoveIcon = getIconsHandler(AppIconType.DELETE);
  const TransferIcon = getIconsHandler(AppIconType.TRANSFER);
  const viewOnly = isVendor;
  return (
    <div className={"flex flex-col gap-5 "}>
      {!viewOnly && (
        <div className={"grid grid-cols-3 gap-5 items-start"}>
          <MyInput
            label={"Vendor"}
            placeholder={"Select vendor"}
            inputType={"select"}
            name={"vendor"}
            isRequired
            options={getVendorOptions(vendors)}
          />
        </div>
      )}
      {values?.vendor && (
        <div className={""}>
          <MyTab
            activeTab={String(selectedCountryIndex)}
            setActiveTab={async (active) => {
              await setCountryIndex(active);
              await setDeliveryIndex("");
            }}
            tabs={countryList?.map((e, key) => {
              return {
                label: (
                  <div className={"flex items-center gap-2"}>
                    {e?.destinationCountry && e?.sourceCountry ? (
                      <div className={"flex items-center gap-2"}>
                        <span>
                          {capitalizeFirstLetter(
                            e?.sourceCountry,
                          )?.toUpperCase()}
                        </span>
                        <span>to</span>
                        <span>
                          {capitalizeFirstLetter(
                            e?.destinationCountry,
                          )?.toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <span>{`New ${key + 1}`}</span>
                    )}

                    {e?.isNew && (
                      <div
                        onClick={async (e) => {
                          e?.stopPropagation();
                          await onDeleteCountry(key);
                        }}
                        className={
                          "p-1 bg-gray-50 hover:bg-gray-100 rounded-sm"
                        }
                      >
                        <RemoveIcon className={"text-gray-500"} />
                      </div>
                    )}
                  </div>
                ),
                key: String(key),
              };
            })}
            tabBarExtraContent={
              !viewOnly && (
                <div className={"pb-1"}>
                  <MyButton
                    onClick={() => onCreateNewCountry()}
                    size={"middle"}
                    name={"Country"}
                    variant={"outlined"}
                    iconType={AppIconType.ADD}
                  />
                </div>
              )
            }
          />

          {selectedCountryIndex && (
            <div className={"flex flex-col gap-5 "}>
              {selectedCountryDetails?.isNew && (
                <div
                  className={
                    "grid grid-cols-[auto_10px_auto] items-center gap-10"
                  }
                >
                  <MyInput
                    isRequired
                    name={`country.${selectedCountryIndex}.sourceCountry`}
                    inputType={"select"}
                    placeholder={"Select destination"}
                    label={"Source country"}
                    options={getCountryOptions()}
                  />
                  <TransferIcon className={"text-[18px]"} />
                  <MyInput
                    isRequired
                    name={`country.${selectedCountryIndex}.destinationCountry`}
                    inputType={"select"}
                    placeholder={"Select country"}
                    label={"Destination country"}
                    options={selectableCountry()}
                  />
                </div>
              )}
              <div className={"grid grid-cols-[250px_auto] gap-10"}>
                <div>
                  <DeliveryTypeComponent
                    viewOnly={viewOnly}
                    delivery={selectedCountryDetails?.delivery}
                    selectDeliveryType={(index) => setDeliveryIndex(index)}
                    selectedDeliveryType={selectedDeliveryIndex}
                    countryIndex={selectedCountryIndex}
                  />
                </div>

                {selectedDeliveryIndex && (
                  <InputFormComponent
                    viewOnly={viewOnly}
                    countryIndex={selectedCountryIndex}
                    deliveryTypeIndex={selectedDeliveryIndex}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const InputFormComponent = ({
  countryIndex,
  deliveryTypeIndex,
  viewOnly,
}: {
  countryIndex: string;
  deliveryTypeIndex: string;
  viewOnly?: boolean;
}) => {
  const { values } = useFormikContext<ICourierRateForm>();
  const {
    options: { deliveryTypes },
  } = useContext(OptionContext);
  const selectedCountryDetail = useMemo(() => {
    return values?.country?.[countryIndex] as ICountryShippingRateForm;
  }, [values?.country, countryIndex]);

  const selectedDeliveryDetail = useMemo(() => {
    return selectedCountryDetail?.delivery?.[
      deliveryTypeIndex
    ] as ICourierDeliveryRateForm;
  }, [selectedCountryDetail, deliveryTypeIndex]);

  const selectableDeliveryType = () => {
    const deliveryTypeOptions = getDeliveryTypeOptions(deliveryTypes);
    return deliveryTypeOptions?.filter((e) => {
      const countryDetails = values?.country?.[
        countryIndex
      ] as ICountryShippingRateForm;

      const currentDeliveryType = selectedDeliveryDetail.deliveryType;

      if (currentDeliveryType == e?.value) return true;

      return !countryDetails?.delivery?.some((value, formIndex) => {
        return value?.deliveryType === e?.value;
      });
    });
  };
  const formIndexName = `country.${countryIndex}.delivery.${deliveryTypeIndex}`;

  return (
    <div className="flex flex-col gap-8 h-full overflow-scroll">
      {/* Top Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {selectedDeliveryDetail?.isNew && (
          <MyInput
            inputType="select"
            options={selectableDeliveryType()}
            name={`${formIndexName}.deliveryType`}
            isRequired
            label="Delivery type"
            placeholder="Select delivery type"
          />
        )}
        <MyInput
          inputType="number"
          disabled={viewOnly}
          name={`${formIndexName}.baseCharge`}
          label="Handling Charge"
          isRequired
          placeholder="eg: 200"
        />
        <MyInput
          inputType="number"
          disabled={viewOnly}
          name={`${formIndexName}.baseChargeCommission`}
          label="Base commission charge"
          isRequired
          placeholder="eg: 200"
        />
      </div>

      {/* Benefits Section */}
      <FieldArray
        name={`${formIndexName}.benefits`}
        render={({ insert, remove, push }) => {
          const benefits = selectedDeliveryDetail?.benefits ?? [];

          return (
            <div className="flex flex-col gap-2">
              {benefits?.length > 0 && (
                <>
                  <span className="text-[1rem] font-bold">Benefits</span>
                  <div className="grid grid-cols-=1 sm:grid-cols-2  gap-2">
                    {benefits.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 w-full"
                      >
                        <div className="flex-1">
                          <MyInput
                            disabled={viewOnly}
                            name={`${formIndexName}.benefits.${index}`}
                            placeholder={`Benefit ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                        {!viewOnly && (
                          <MyButton
                            iconType={AppIconType.DELETE}
                            color="danger"
                            variant="outlined"
                            onClick={() => remove(index)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {!viewOnly && (
                <MyButton
                  iconType={AppIconType.ADD}
                  size={"middle"}
                  name="Benefit"
                  variant="outlined"
                  onClick={() => push("")}
                  className="self-start"
                />
              )}
            </div>
          );
        }}
      />

      {/* Rate Slab Table */}
      <FieldArray
        name={`${formIndexName}.rateSlab`}
        render={({ insert, remove }) => {
          const RateSlabColumn: ITableColumns<ICourierRateCharge>[] = [
            {
              title: "S.N",
              render: (_, __, index) => <span>{index + 1}.</span>,
            },
            {
              title: "Min. KG.",
              render: (_, __, index) => (
                <MyInput
                  inputType="number"
                  disabled={viewOnly}
                  placeholder="eg: 1"
                  name={`${formIndexName}.rateSlab.${index}.minKG`}
                />
              ),
            },
            {
              title: "Max. KG.",
              render: (_, __, index) => (
                <MyInput
                  inputType="number"
                  placeholder="eg: 2"
                  disabled={viewOnly}
                  name={`${formIndexName}.rateSlab.${index}.maxKG`}
                />
              ),
            },
            {
              title: "Charge (Rs.)",
              render: (_, __, index) => (
                <MyInput
                  disabled={viewOnly}
                  inputType="number"
                  placeholder="eg: 10"
                  name={`${formIndexName}.rateSlab.${index}.charge`}
                />
              ),
            },
            {
              title: "Commission (Rs.)",
              render: (_, __, index) => (
                <MyInput
                  inputType="number"
                  disabled={viewOnly}
                  placeholder="eg: 10"
                  name={`${formIndexName}.rateSlab.${index}.commission`}
                />
              ),
            },
            {
              title: "Rate Type",
              render: (_, __, index) => (
                <MyInput
                  disabled={viewOnly}
                  name={`${formIndexName}.rateSlab.${index}.rateType`}
                  inputType="select"
                  options={[
                    { label: "Flat", value: CourierRateType.FLAT },
                    { label: "Per. KG.", value: CourierRateType.PER_KG },
                  ]}
                />
              ),
            },
            {
              title: "Handling Free?",
              render: (_, __, index) => (
                <div className="flex justify-center">
                  <MyInput
                    disabled={viewOnly}
                    name={`${formIndexName}.rateSlab.${index}.freeHandlingCharge`}
                    inputType="checkbox"
                  />
                </div>
              ),
            },
            !viewOnly && {
              title: "Action",
              render: (_, __, index) => (
                <div className="flex items-center gap-2">
                  <MyButton
                    variant="outlined"
                    onClick={() =>
                      insert(index + 1, CourierRateFormik.rateValues())
                    }
                    iconType={AppIconType.ADD}
                  />
                  {index !== 0 && (
                    <MyButton
                      color="danger"
                      variant="outlined"
                      onClick={() => remove(index)}
                      iconType={AppIconType.DELETE}
                    />
                  )}
                </div>
              ),
            },
          ];

          return (
            <div className="flex flex-col gap-4 h-full overflow-scroll hide-scrollbar">
              <span className="text-[1rem] font-bold">Rate Slab</span>

              {/* Table View (md and up) */}
              <div className="hidden lg:block h-full overflow-scroll">
                <MyTable
                  columns={RateSlabColumn?.filter((e) => e)}
                  data={selectedDeliveryDetail?.rateSlab}
                />
              </div>

              {/* Card View (sm and below) */}
              <div className="flex flex-col gap-4 lg:hidden">
                {(selectedDeliveryDetail?.rateSlab ?? []).map((_, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        Slab {index + 1}
                      </span>
                      {!viewOnly && (
                        <div className="flex gap-2">
                          <MyButton
                            variant="outlined"
                            iconType={AppIconType.ADD}
                            onClick={() =>
                              insert(index + 1, CourierRateFormik.rateValues())
                            }
                          />
                          {index !== 0 && (
                            <MyButton
                              variant="outlined"
                              color="danger"
                              iconType={AppIconType.DELETE}
                              onClick={() => remove(index)}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <MyInput
                      inputType="number"
                      label="Min. KG"
                      placeholder="eg: 1"
                      disabled={viewOnly}
                      name={`${formIndexName}.rateSlab.${index}.minKG`}
                    />
                    <MyInput
                      inputType="number"
                      label="Max. KG"
                      placeholder="eg: 2"
                      disabled={viewOnly}
                      name={`${formIndexName}.rateSlab.${index}.maxKG`}
                    />
                    <MyInput
                      inputType="number"
                      label="Charge (Rs.)"
                      placeholder="eg: 10"
                      disabled={viewOnly}
                      name={`${formIndexName}.rateSlab.${index}.charge`}
                    />
                    <MyInput
                      inputType="number"
                      label="Commission (Rs.)"
                      placeholder="eg: 10"
                      disabled={viewOnly}
                      name={`${formIndexName}.rateSlab.${index}.commission`}
                    />
                    <MyInput
                      inputType="select"
                      label="Rate Type"
                      disabled={viewOnly}
                      name={`${formIndexName}.rateSlab.${index}.rateType`}
                      options={[
                        { label: "Flat", value: CourierRateType.FLAT },
                        { label: "Per. KG.", value: CourierRateType.PER_KG },
                      ]}
                    />
                    <div className="flex items-center gap-2">
                      <MyInput
                        disabled={viewOnly}
                        name={`${formIndexName}.rateSlab.${index}.freeHandlingCharge`}
                        inputType="checkbox"
                      />
                      <label className="text-sm">Handling Free?</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      />

      {!viewOnly && <MyFormSubmitButton />}
    </div>
  );
};

const DeliveryTypeComponent = ({
  delivery,
  selectDeliveryType,
  selectedDeliveryType,
  countryIndex,
  viewOnly,
}: {
  delivery: ICourierDeliveryRateForm[];
  selectDeliveryType: (index: string) => void;
  selectedDeliveryType: string;
  countryIndex: string;
  viewOnly?: boolean;
}) => {
  const {
    options: { deliveryTypes },
    optionObject: { deliveryTypeObject },
  } = useContext(OptionContext);
  const { deleteHandler, getListHandler } = useContext(CourierRateContext);
  const AddIcon = getIconsHandler(AppIconType.ADD);
  const { values, setFieldValue } = useFormikContext<ICourierRateForm>();
  const [cloneRate, setCloneRate] = useState(undefined);
  const selectedCountry = values?.country?.[
    countryIndex
  ] as ICountryShippingRateForm;
  const onAddDelivery = async () => {
    const deliveryType = [
      ...values?.country?.[countryIndex]?.delivery,
      CourierRateFormik.courierRateValues({
        isNew: true,
        benefits: [],
      }),
    ];
    await setFieldValue(`country.${countryIndex}.delivery`, deliveryType);
  };
  const DeleteIcon = getIconsHandler(AppIconType.DELETE);
  const onDeleteCountry = async (index: number) => {
    let tempValues = [...values?.country?.[countryIndex]?.delivery];
    tempValues.splice(index, 1);
    await setFieldValue(`country.${countryIndex}.delivery`, tempValues);

    if (selectedDeliveryType == String(index)) {
      await setFieldValue("selectedDeliveryIndex", "");
    }
  };
  return (
    <div className={"flex flex-col gap-2 bg-white rounded-md overflow-hidden"}>
      <div className={"text-sm border-b p-2 bg-black text-white"}>
        Delivery Type
      </div>
      <div className={"flex flex-col gap-2 px-2"}>
        {delivery?.map((e, key) => {
          const isSelected = String(key) == selectedDeliveryType;
          return (
            <div
              className={` flex items-center justify-between  cursor-pointer  ${isSelected ? "text-blue-500" : ""}`}
              key={key}
              onClick={() => selectDeliveryType(String(key))}
            >
              {e?.deliveryType
                ? deliveryTypeObject?.[e?.deliveryType]?.name
                : `New ${key + 1}`}
              {e?.isNew ? (
                <div
                  onClick={async (e) => {
                    e?.stopPropagation();
                    await onDeleteCountry(key);
                  }}
                  className={"p-1 bg-gray-50 hover:bg-gray-100 rounded-sm"}
                >
                  <DeleteIcon className={"text-gray-500"} />
                </div>
              ) : (
                !viewOnly && (
                  <MyMoreOption
                    items={[
                      {
                        label: "Clone",
                        onClick: () => {
                          setCloneRate(e?._id);
                        },
                      },
                      {
                        label: "Delete",
                        color: "red",
                        onClick: async () => {
                          await deleteHandler(e?._id, {
                            onSuccess: async () => {
                              await getListHandler({ vendor: values?.vendor });
                            },
                          });
                        },
                      },
                    ]}
                  />
                )
              )}
            </div>
          );
        })}
        {delivery?.length !== deliveryTypes?.length && !viewOnly && (
          <div
            className={`flex items-center gap-2 pb-2 border-b cursor-pointer text-sm `}
            onClick={() => onAddDelivery()}
          >
            <AddIcon /> <span>New</span>
          </div>
        )}
        {cloneRate && (
          <CloneRateSlapModal
            destinationCountry={selectedCountry?.destinationCountry}
            sourceCountry={selectedCountry?.sourceCountry}
            deliveryType={
              selectedCountry?.delivery?.[selectedDeliveryType]?.deliveryType
            }
            rateSlab={cloneRate}
            vendor={values?.vendor}
            closeHandler={() => setCloneRate(undefined)}
          />
        )}
      </div>
    </div>
  );
};

const CloneRateSlapModal = ({
  rateSlab,
  vendor,
  closeHandler,
  destinationCountry,
  sourceCountry,
  deliveryType,
}: {
  rateSlab: string;
  vendor: string;
  closeHandler(): void;
  sourceCountry: string;
  destinationCountry: string;
  deliveryType: string;
}) => {
  const {
    options: { deliveryTypes, vendors },
  } = useContext(OptionContext);
  const { cloneRateSlapHandler, getListHandler } =
    useContext(CourierRateContext);
  const onSubmitHandler = async (values: any) => {
    await cloneRateSlapHandler(values, {
      onSuccess: async () => {
        await getListHandler({ vendor: values?.vendor });
      },
    });
  };
  return (
    <MyModal onCancel={closeHandler} title={"Clone Rate Slap"}>
      <Formik
        initialValues={{
          vendor: vendor,
          deliveryType: deliveryType,
          sourceCountry: sourceCountry,
          destinationCountry: destinationCountry,
          courierRateID: rateSlab,
        }}
        validationSchema={yup.object().shape({
          vendor: yup.string().required(" "),
          deliveryType: yup.string().required(" "),
          sourceCountry: yup.string().required(" "),
          destinationCountry: yup.string().required(" "),
          courierRateID: yup.string().required(" "),
        })}
        onSubmit={onSubmitHandler}
      >
        <Form className={"flex flex-col gap-2"}>
          <MyInput
            label={"Vendor"}
            name={"vendor"}
            isRequired
            inputType={"select"}
            options={getVendorOptions(vendors)}
          />{" "}
          <MyInput
            label={"Source"}
            name={"sourceCountry"}
            isRequired
            inputType={"select"}
            options={getCountryOptions()}
          />{" "}
          <MyInput
            label={"Destination"}
            name={"destinationCountry"}
            isRequired
            inputType={"select"}
            options={getCountryOptions()}
          />{" "}
          <MyInput
            label={"Delivery Type"}
            name={"deliveryType"}
            isRequired
            inputType={"select"}
            options={getDeliveryTypeOptions(deliveryTypes)}
          />
          <MyFormSubmitButton />
        </Form>
      </Formik>
    </MyModal>
  );
};

export default EditCourierRateForm;

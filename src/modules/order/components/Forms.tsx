import React, { useContext, useEffect, useMemo, useState } from "react";
import { MyButton, MyInput, MyModal, MyTable } from "components";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import {
  AppIconType,
  CouponDiscountTypeEnum,
  IFreightCharge,
  IOrder,
  IOrderItems,
  IPackageInvoiceItem,
  ITableColumns,
  IUserPackageOrderPayload,
  PackageStatusEnum,
} from "interfaces";
import {
  calcVolumetricWeight,
  capitalizeFirstLetter,
  getCommodityOptions,
  getCurrencyOptions,
  getDeliveryTypeOptions,
  getIconsHandler,
  getINCOTerms,
  getUnitOptions,
  getVendorOptions,
  getWeightRangeOptions,
} from "utils";
import { calculatePackageWeight } from "../helpers";
import { OptionContext, OrderContext } from "context";
import { useApiManager, useAuthorization, useScreenSize } from "hooks";
import { ActivityContext } from "../context";
import moment from "moment";
import { BillingAmountDetails } from "./BillingDetailsComponent";
import {
  ChargesValues,
  ConsigneeValidationSchema,
  InvoicePackageValues,
  PackageItemsValues,
  ShipperValidationSchema,
} from "../formikValues";

export function PickupDetailsForm({
  hideSelfDropField,
  hidePackageDetails,
}: {
  hideSelfDropField?: boolean;
  hidePackageDetails?: boolean;
}) {
  const { values } = useFormikContext<IUserPackageOrderPayload>();
  return (
    <div className={"flex flex-col gap-2"}>
      <div
        className={
          " flex sm:items-center items-start sm:flex-row flex-col gap-2"
        }
      >
        {!hideSelfDropField && (
          <MyInput
            label={"Self drop-off at courier"}
            inputType={"checkbox"}
            name={`isSelfDrop`}
          />
        )}
        <MyInput
          label={"Shipment Includes Document?"}
          inputType={"checkbox"}
          name={`isDox`}
        />
      </div>
      {!values?.isSelfDrop && (
        <MyInput
          minDate={new Date().toDateString()}
          name={`pickupTimeSlot`}
          inputType={"date"}
          isRequired
          label={"Pickup time slot"}
        />
      )}
      <MyInput
        name={"specialInstructionByCustomer"}
        inputType={"text-area"}
        placeholder={"Enter instruction"}
        label={"Instruction"}
      />
      {!hidePackageDetails && (
        <div className={"flex flex-col gap-2"}>
          <span className={"font-medium text-sm"}>
            What to deliver <span className={"text-red-500"}>*</span>
          </span>
          <MyInput
            name="itemsCustomer.0.description"
            inputType="text-area"
            placeholder="Contents of Parcel: Clothing, dried meat, and other miscellaneous items."
            isRequired
            options={getWeightRangeOptions()}
          />
          <MyInput
            name="itemsCustomer.0.weight"
            inputType="number"
            label={"Approx. weight K.G."}
            placeholder="Courier approx. weight"
            isRequired
          />
        </div>
      )}
    </div>
  );
}

export function ConsigneeForm() {
  return (
    <div className={"flex flex-col gap-2"}>
      <MyInput
        name={`consignee.name`}
        isRequired
        placeholder={"eg: John Doe"}
        label={"Name"}
      />
      <MyInput
        name={`consignee.email`}
        placeholder={"eg: john@gmail.com"}
        label={"Email"}
      />
      <div className={"grid grid-cols-2 items-start gap-2"}>
        <MyInput
          name={`consignee.phone`}
          isRequired
          placeholder={"Enter phone"}
          label={"Phone"}
        />
        <MyInput
          name={`consignee.secondaryPhone`}
          placeholder={"Enter secondary phone"}
          label={"Secondary phone"}
        />
      </div>

      <div className={"flex flex-col gap-2"}>
        <span className={"font-medium"}>Address</span>
        <div className={"grid grid-cols-2 gap-2 items-start"}>
          <MyInput
            name={`consignee.address.street`}
            placeholder={"Enter street"}
            label={"Street"}
            isRequired
          />{" "}
          <MyInput
            name={`consignee.address.city`}
            placeholder={"Enter city"}
            label={"City"}
            isRequired
          />{" "}
          <MyInput
            name={`consignee.address.county`}
            placeholder={"Enter state"}
            label={"State"}
          />{" "}
          <MyInput
            name={`consignee.address.postalCode`}
            placeholder={"Enter postal code"}
            label={"Postal code"}
          />
        </div>
      </div>
    </div>
  );
}

export function ShipperForm() {
  return (
    <div className={" flex flex-col gap-2"}>
      <MyInput
        name={`shipper.name`}
        isRequired
        placeholder={"eg: John Doe"}
        label={"Name"}
      />{" "}
      <MyInput
        name={`shipper.email`}
        placeholder={"eg: shipper@gmail.com"}
        label={"Email"}
      />
      <MyInput
        name={`shipper.phone`}
        isRequired
        placeholder={"Enter phone"}
        label={"Contact"}
      />
      <MyInput
        name={`shipper.address`}
        isRequired
        placeholder={"Enter address"}
        label={"Address"}
      />
      <MyInput
        name={`shipper.landmark`}
        placeholder={"Enter landmark"}
        label={"Landmark"}
      />
    </div>
  );
}

export function PickupAgentForm() {
  const {
    options: { deliveryPartner },
  } = useContext(OptionContext);
  return (
    <>
      <MyInput
        name={"vendor"}
        isRequired
        inputType={"select"}
        placeholder={"Select delivery partner"}
        options={getVendorOptions(deliveryPartner)}
        label={"Delivery Partner"}
      />
      <MyInput
        name={"name"}
        isRequired
        label={"Name"}
        placeholder={"Enter name"}
      />
      <MyInput name={"email"} label={"Email"} placeholder={"Enter email"} />
      <MyInput
        name={"phone"}
        isRequired
        label={"Phone"}
        placeholder={"Enter phone"}
      />
      <MyInput
        name={"remarks"}
        label={"Remarks"}
        inputType={"text-area"}
        placeholder={"Enter remarks"}
      />
    </>
  );
}

export function PackageBulkForm({
  fieldName = "itemsVendor",
}: {
  fieldName: string;
}) {
  const { values } = useFormikContext<IUserPackageOrderPayload>();
  const {
    options: { commodity },
  } = useContext(OptionContext);
  const { isSmScreen } = useScreenSize();
  const stats = useMemo(() => {
    let totalVolWeight = 0,
      totalWeight = 0,
      totalChargeableWeight = 0;
    values?.[fieldName]?.forEach((e) => {
      totalWeight += e?.weight;
      totalVolWeight += calcVolumetricWeight(e?.length, e?.breadth, e?.height);
      totalChargeableWeight += Math.max(
        calcVolumetricWeight(e?.length, e?.breadth, e?.height),
        e?.weight,
      );
    });

    return {
      totalVolWeight: totalVolWeight,
      totalWeight: totalWeight,
      totalChargeableWeight: totalChargeableWeight,
    };
  }, [values?.[fieldName]]);
  return (
    <FieldArray
      name={fieldName}
      render={({ push, remove, insert }) => {
        const TableColumns: ITableColumns<IOrderItems>[] = [
          {
            title: "S.N.",
            hidden: isSmScreen,
            render: (values, record, index) => {
              return <>{record?.serialNumber || index + 1}.</>;
            },
          },
          {
            title: "Description",
            render: (values, record, index) => {
              return (
                <div className={"min-w-[200px]"}>
                  <MyInput
                    placeholder={
                      "Contents of Parcel: Clothing, dried meat, and other miscellaneous items."
                    }
                    inputSize={"middle"}
                    name={`${fieldName}.${index}.description`}
                  />
                </div>
              );
            },
          },
          {
            title: "Commodity",
            render: (values, record, index) => {
              return (
                <div className={"min-w-[200px]"}>
                  <MyInput
                    placeholder={"Select commodities"}
                    name={`${fieldName}.${index}.commodity`}
                    inputSize={"middle"}
                    inputType={"select"}
                    options={getCommodityOptions(commodity)}
                  />
                </div>
              );
            },
          },
          {
            title: "L (cm.)",
            minWidth: 100,

            render: (values, record, index) => {
              return (
                <MyInput
                  inputSize={"middle"}
                  inputType={"number"}
                  name={`${fieldName}.${index}.length`}
                  placeholder={"0.00"}
                />
              );
            },
          },
          {
            title: "B (cm.)",
            minWidth: 100,

            render: (values, record, index) => {
              return (
                <MyInput
                  inputSize={"middle"}
                  inputType={"number"}
                  name={`${fieldName}.${index}.breadth`}
                  placeholder={"0.00"}
                />
              );
            },
          },
          {
            title: "H (cm.)",
            minWidth: 100,

            render: (values, record, index) => {
              return (
                <MyInput
                  inputSize={"middle"}
                  inputType={"number"}
                  name={`${fieldName}.${index}.height`}
                  placeholder={"0.00"}
                />
              );
            },
          },
          {
            title: "WT.",
            minWidth: 100,
            render: (values, record, index) => {
              return (
                <MyInput
                  inputSize={"middle"}
                  name={`${fieldName}.${index}.weight`}
                  inputType={"number"}
                  placeholder={"0.00"}
                />
              );
            },
          },
          {
            title: "Vol. WT.",
            render: (values, record, index) => {
              return `${calcVolumetricWeight(
                record?.length,
                record?.breadth,
                record?.height,
              )} KG.`;
            },
          },
          {
            title: "Chargeable WT.",
            render: (values, record, index) => {
              return `${
                Math.max(
                  calcVolumetricWeight(
                    record?.length,
                    record?.breadth,
                    record?.height,
                  ),
                  record.weight,
                ) || 0
              } KG.`;
            },
          },
          {
            title: "",
            render: (a, record, index) => {
              return (
                <div className={"flex items-center gap-2"}>
                  <MyButton
                    size={"small"}
                    variant={"outlined"}
                    color={"red"}
                    iconType={AppIconType.DELETE}
                    onClick={() => remove(index)}
                  />
                  <MyButton
                    size={"small"}
                    variant={"outlined"}
                    color={"blue"}
                    iconType={AppIconType.ADD}
                    onClick={() =>
                      insert(
                        index + 1,
                        PackageItemsValues({
                          serialNumber: values?.[fieldName]?.length + 1,
                        }),
                      )
                    }
                  />
                </div>
              );
            },
          },
        ];
        return (
          <div className={"flex flex-col gap-4 p-4 bg-white rounded-3xl"}>
            <div className={"flex items-center justify-between"}>
              <span className={"font-semibold text-base"}>Parcels</span>
              <div
                className={
                  "flex sm:items-center items-start  gap-2 justify-between"
                }
              >
                <div
                  className={
                    "flex items-center sm:gap-5 gap-x-5 gap-y-2 flex-wrap"
                  }
                >
                  <div className={"flex items-center gap-2 text-xs "}>
                    <span>Total weight:</span>
                    <span
                      className={"bg-gray-100 text-black p-1 px-2 rounded-sm"}
                    >
                      {stats?.totalWeight || 0} kg.
                    </span>
                  </div>

                  <>
                    <div className={"flex items-center gap-2 text-xs "}>
                      <span>Volumetric weight:</span>
                      <span
                        className={"bg-gray-100 text-black p-1 px-2 rounded-sm"}
                      >
                        {stats?.totalVolWeight || 0} kg.
                      </span>
                    </div>
                    <div className={"flex items-center gap-2 text-xs "}>
                      <span>Total chargeable weight:</span>
                      <span
                        className={"bg-gray-100 text-black p-1 px-2 rounded-sm"}
                      >
                        {stats?.totalChargeableWeight || 0} kg.
                      </span>
                    </div>
                  </>
                </div>
              </div>
            </div>
            <div className={"overflow-x-scroll"}>
              <MyTable columns={TableColumns} data={values?.[fieldName]} />
            </div>
            {values?.[fieldName]?.length < 1 && (
              <div>
                <MyButton
                  color={"blue"}
                  variant={"outlined"}
                  size={"middle"}
                  name={"Add"}
                  iconType={AppIconType.ADD}
                  onClick={() =>
                    push(
                      PackageItemsValues({
                        serialNumber: 1,
                      }),
                    )
                  }
                />
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

export function InvoiceForm() {
  const { values, setFieldValue } =
    useFormikContext<IUserPackageOrderPayload>();
  const {
    optionObject: { commodityObject },
  } = useContext(OptionContext);
  const copyPackageItems = async () => {
    let count = 1;
    const newInvoiceItems: IPackageInvoiceItem[] =
      values?.itemsVendor?.flatMap((item) => {
        if (!item?.commodity?.length) {
          return {
            ...InvoicePackageValues({
              packageNumber: item?.serialNumber,
              particular: item?.description,
              serialNumber: count++,
              quantity: 1,
            }),
          };
        }

        return item.commodity.map((commodity) => ({
          ...InvoicePackageValues({
            packageNumber: item?.serialNumber,
            particular:
              commodityObject?.[typeof commodity == "string" ? commodity : ""]
                ?.name,
            serialNumber: count++,
            quantity: 1,
          }),
        }));
      }) || [];

    await setFieldValue("invoice.items", newInvoiceItems);
  };

  const stats = (() => {
    let totalAmount = 0,
      totalWeight = 0,
      totalQuantity = 0;

    values?.invoice?.items?.forEach((e) => {
      totalWeight += (e?.unitWeight || 0) * (e?.quantity || 0);
      totalAmount += (e?.unitRate || 0) * (e?.quantity || 0);
      totalQuantity += e?.quantity || 0;
    });

    return {
      totalAmount,
      totalWeight,
      totalQuantity,
    };
  })();

  const Details = {
    "Total Quantity:": stats?.totalQuantity,
    "Total Weight:": stats?.totalWeight,
    "Total Amount:": stats?.totalAmount,
  };

  return (
    <div className={"flex flex-col gap-4 p-4 bg-white rounded-3xl"}>
      <div className={"flex items-center gap-5 justify-between select-none"}>
        <div className={"flex items-center gap-2  cursor-pointer select-none "}>
          <span className={"font-semibold text-base"}>Invoice</span>
        </div>
        <MyButton
          name={"Sync"}
          onClick={() => copyPackageItems()}
          size={"small"}
          variant={"outlined"}
          color={"blue"}
          iconType={AppIconType.REFRESH}
        />
      </div>
      <div className={"flex flex-col gap-2 w-full"}>
        <div className={"grid grid-cols-5 gap-x-5 gap-y-2"}>
          <MyInput
            inputSize={"middle"}
            name={`invoice.invoiceNumber`}
            placeholder={"Enter invoice number"}
            label={"Invoice Number"}
          />
          <MyInput
            inputSize={"middle"}
            inputType={"date"}
            name={`invoice.invoiceDate`}
            label={"Invoice Date"}
          />
          <MyInput
            inputSize={"middle"}
            placeholder={"Enter reference number"}
            name={`invoice.referenceNumber`}
            label={"Reference Number"}
            inputType={"number"}
          />
          <MyInput
            inputSize={"middle"}
            name={`invoice.shipmentValue`}
            placeholder={"Enter shipment value"}
            label={"Shipment Value"}
          />
          <MyInput
            inputSize={"middle"}
            inputType={"select"}
            options={[
              {
                label: "INVOICE & PACKAGE LIST",
                value: "INVOICE & PACKAGE LIST",
              },
              {
                label: "PROFORMA INVOICE",
                value: "PROFORMA INVOICE",
              },
            ]}
            placeholder={"Enter invoice type"}
            name={`invoice.invoiceType`}
            label={"Invoice Type"}
          />
          <MyInput
            inputSize={"middle"}
            placeholder={"Select currency"}
            options={getCurrencyOptions()}
            inputType={"select"}
            name={`invoice.currency`}
            label={"Currency"}
          />
          <MyInput
            inputSize={"middle"}
            inputType={"select"}
            options={getINCOTerms()}
            placeholder={"Enter INCO terms"}
            name={`invoice.INCOTerms`}
            label={"INCO Terms"}
          />
          <div className={"col-span-3"}>
            <MyInput
              inputSize={"middle"}
              placeholder={"Enter invoice note"}
              name={`invoice.note`}
              label={"Note"}
            />
          </div>
        </div>
        <div className={"flex items-center gap-5 justify-end  pt-2 "}>
          {Object.keys(Details)?.map((key) => {
            return (
              <div key={key} className={"flex items-center gap-2 text-xs "}>
                <span>{key}</span>
                <span className={"bg-gray-100 text-black p-1 px-2 rounded-sm"}>
                  {Details?.[key]}
                </span>
              </div>
            );
          })}
        </div>
        <FieldArray
          name={"invoice.items"}
          render={({ push, remove, insert }) => {
            const TableColumns: ITableColumns<IPackageInvoiceItem>[] = [
              {
                title: "Package",
                minWidth: 100,
                render: (v, record, index) => {
                  return (
                    <MyInput
                      placeholder={"Package"}
                      options={values?.itemsVendor?.map((e) => ({
                        label: e?.serialNumber,
                        value: e?.serialNumber,
                      }))}
                      inputSize={"middle"}
                      inputType={"select"}
                      name={`invoice.items.${index}.packageNumber`}
                      isRequired
                    />
                  );
                },
              },
              {
                title: "SR. No.",
                minWidth: 100,
                render: (values, record, index) => {
                  return (
                    <MyInput
                      placeholder={"SR. No."}
                      inputSize={"middle"}
                      name={`invoice.items.${index}.serialNumber`}
                      isRequired
                    />
                  );
                },
              },
              {
                title: "Description",
                minWidth: 200,

                render: (values, record, index) => {
                  return (
                    <MyInput
                      placeholder={"Description"}
                      inputSize={"middle"}
                      name={`invoice.items.${index}.particular`}
                    />
                  );
                },
              },
              {
                title: "HS Code",
                minWidth: 100,
                render: (values, record, index) => {
                  return (
                    <MyInput
                      placeholder={"Code"}
                      inputSize={"middle"}
                      name={`invoice.items.${index}.HS_CODE`}
                    />
                  );
                },
              },
              {
                title: "Unit",
                minWidth: 140,
                render: (values, record, index) => {
                  return (
                    <MyInput
                      placeholder={"unit"}
                      inputType={"select"}
                      options={getUnitOptions()}
                      inputSize={"middle"}
                      name={`invoice.items.${index}.unitType`}
                    />
                  );
                },
              },
              {
                title: "QTY.",
                minWidth: 100,

                render: (values, record, index) => {
                  return (
                    <MyInput
                      placeholder={"0"}
                      inputType={"number"}
                      inputSize={"middle"}
                      name={`invoice.items.${index}.quantity`}
                    />
                  );
                },
              },
              {
                title: "Unit Weight (Kg.)",
                minWidth: 100,
                render: (values, record, index) => {
                  return (
                    <MyInput
                      placeholder={"0.00"}
                      inputType={"number"}
                      inputSize={"middle"}
                      name={`invoice.items.${index}.unitWeight`}
                    />
                  );
                },
              },
              {
                title: "Total Weight (Kg.)",
                minWidth: 100,
                render: (values, record, index) => {
                  return record?.unitWeight * record?.quantity || "N/A";
                },
              },
              {
                title: "Unit Rate",
                minWidth: 100,
                render: (values, record, index) => {
                  return (
                    <MyInput
                      placeholder={"0.00"}
                      inputSize={"middle"}
                      inputType={"number"}
                      name={`invoice.items.${index}.unitRate`}
                    />
                  );
                },
              },
              {
                title: "Total Rate",
                minWidth: 100,
                render: (a, record, index) => {
                  return `${values?.invoice?.currency || ""} ${record?.unitRate * record?.quantity || 0}`;
                },
              },
              {
                title: "",
                render: (values, record, index) => {
                  return (
                    <div className={"flex  gap-2"}>
                      <MyButton
                        size={"small"}
                        variant={"outlined"}
                        color={"red"}
                        iconType={AppIconType.DELETE}
                        onClick={() => remove(index)}
                      />
                      <MyButton
                        size={"small"}
                        variant={"outlined"}
                        color={"blue"}
                        iconType={AppIconType.ADD}
                        onClick={() =>
                          insert(index + 1, InvoicePackageValues())
                        }
                      />
                    </div>
                  );
                },
              },
            ];
            if (values?.invoice?.items?.length < 1) {
              return (
                <div>
                  <MyButton
                    color={"blue"}
                    variant={"outlined"}
                    size={"middle"}
                    name={"Add invoice items"}
                    iconType={AppIconType.ADD}
                    onClick={() => push(InvoicePackageValues())}
                  />
                </div>
              );
            }
            return (
              <div className={"overflow-x-scroll"}>
                <MyTable columns={TableColumns} data={values?.invoice?.items} />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

export function ManageConsigneeDetails() {
  const { values } = useFormikContext<IUserPackageOrderPayload>();
  const isFilled = values?.consignee?.name;
  const [isOpen, setOpen] = useState(false);
  const EditIcon = getIconsHandler(AppIconType.EDIT);
  const consigneeDetails = values?.consignee;

  const onSubmit = async () => {
    try {
      await ConsigneeValidationSchema.validate(
        { consignee: consigneeDetails },
        {
          abortEarly: false,
        },
      );
      setOpen(false);
    } catch (err) {}
  };
  const filledReceiverDetails =
    values?.consignee?.name &&
    values?.consignee?.phone &&
    values?.consignee?.address?.postalCode &&
    values?.consignee?.address?.street &&
    values?.consignee?.address?.city;
  return (
    <>
      {isFilled ? (
        <div
          className={
            "flex flex-col bg-ash-100 p-2 rounded-md text-sm text-gray-500"
          }
        >
          <div className={"flex items-center justify-between"}>
            <span className={"text-black text-[16px]"}>
              {values?.consignee?.name}
            </span>
            <EditIcon
              className={"cursor-pointer "}
              onClick={() => setOpen(true)}
            />
          </div>
          <span>{consigneeDetails?.email}</span>
          <span>
            {consigneeDetails?.phone} {consigneeDetails?.secondaryPhone}
          </span>
          <span>
            {consigneeDetails?.address?.street},{" "}
            {consigneeDetails?.address?.city},{" "}
            {consigneeDetails?.address?.county},{" "}
            {consigneeDetails?.address?.postalCode}
          </span>
        </div>
      ) : (
        <MyButton
          onClick={() => setOpen(true)}
          iconType={AppIconType.ADD}
          variant={"text"}
          color={"blue"}
          name={"Add receiver details"}
        />
      )}
      {isOpen && (
        <MyModal
          title={"Receiver Details"}
          onCancel={filledReceiverDetails ? () => setOpen(false) : undefined}
        >
          <div className={"flex flex-col gap-4"}>
            <ConsigneeForm />
            <MyButton
              disabled={!filledReceiverDetails}
              name={"Submit"}
              onClick={onSubmit}
            />
          </div>
        </MyModal>
      )}
    </>
  );
}

export function ManageShipperDetails() {
  const { values } = useFormikContext<IUserPackageOrderPayload>();
  const isFilled = values?.shipper?.name;
  const [isOpen, setOpen] = useState(false);
  const EditIcon = getIconsHandler(AppIconType.EDIT);
  const details = values?.shipper;
  const onSubmit = async () => {
    try {
      await ShipperValidationSchema.validate(
        { shipper: details },
        {
          abortEarly: false,
        },
      );
      setOpen(false);
    } catch (err) {}
  };
  return (
    <>
      {isFilled ? (
        <div
          className={
            "flex flex-col bg-ash-100 p-2 rounded-md text-sm text-gray-500"
          }
        >
          <div className={"flex items-center justify-between "}>
            <span className={"text-black text-[16px]"}>{details?.name}</span>
            <EditIcon
              className={"cursor-pointer text-sm"}
              onClick={() => setOpen(true)}
            />
          </div>
          <span>{details?.email}</span>
          <span>{details?.phone}</span>
          <span>{details?.address}</span>
        </div>
      ) : (
        <MyButton
          onClick={() => setOpen(true)}
          iconType={AppIconType.ADD}
          variant={"text"}
          color={"blue"}
          name={"Add sender details"}
        />
      )}
      {isOpen && (
        <MyModal title={"Sender Details"} onCancel={() => setOpen(false)}>
          <div className={"flex flex-col gap-4"}>
            <ShipperForm />
            <MyButton name={"Submit"} color={"default"} onClick={onSubmit} />
          </div>
        </MyModal>
      )}
    </>
  );
}

export const SourceDestinationCountryForm = ({
  onlyCountry,
  hideLabel,
}: {
  onlyCountry?: boolean;
  hideLabel?: boolean;
}) => {
  const { values, setFieldValue } = useFormikContext<IOrder>();
  const {
    isCourierCountryLoading,
    courierCountry,
    getCourierCountryHandler,
    getDeliveryTypeHandler,
    deliveryTypes,
  } = useApiManager();
  const SourceCountry = useMemo(() => {
    return Object.keys(courierCountry || {});
  }, [isCourierCountryLoading, courierCountry]);

  const DestinationCountry = useMemo(() => {
    return courierCountry?.[values?.sourceCountry] || [];
  }, [isCourierCountryLoading, courierCountry, values?.sourceCountry]);

  useEffect(() => {
    (async () => {
      if (!values?.sourceCountry) return;
      if (values?.destinationCountry) return;
      await setFieldValue("destinationCountry", DestinationCountry?.[0] || "");
    })();
  }, [SourceCountry, DestinationCountry, values?.sourceCountry]);
  useEffect(() => {
    (async () => {
      if (values?.sourceCountry) return;
      await setFieldValue("sourceCountry", SourceCountry?.[0] || "");
    })();
  }, [SourceCountry]);
  useEffect(() => {
    (async () => {
      await getCourierCountryHandler();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!(values?.sourceCountry && values?.destinationCountry)) return;
      await getDeliveryTypeHandler(
        values?.sourceCountry,
        values?.destinationCountry,
      );
    })();
  }, [values?.sourceCountry, values?.destinationCountry]);

  return (
    <>
      <MyInput
        name={"sourceCountry"}
        inputType={"select"}
        inputSize={onlyCountry ? "large" : "middle"}
        label={!hideLabel && "Source country"}
        isRequired
        onChange={async () => {
          await setFieldValue("destinationCountry", "");
        }}
        placeholder={"Source country"}
        options={SourceCountry?.map((e) => ({
          value: e,
          label: capitalizeFirstLetter(e),
        }))}
      />{" "}
      <MyInput
        inputSize={onlyCountry ? "large" : "middle"}
        name={"destinationCountry"}
        label={!hideLabel && "Destination country"}
        inputType={"select"}
        placeholder={"Destination country"}
        isRequired
        options={DestinationCountry?.map((e) => ({
          value: e,
          label: capitalizeFirstLetter(e),
        }))}
      />
      {!onlyCountry && (
        <MyInput
          inputSize={"middle"}
          label={!hideLabel && "Delivery type"}
          name={"deliveryType"}
          inputType={"select"}
          isRequired
          placeholder={"Delivery type"}
          options={getDeliveryTypeOptions(deliveryTypes?.docs)}
        />
      )}
    </>
  );
};

export const FITReceiptDetails = () => {
  const { values } = useFormikContext<IUserPackageOrderPayload>();
  const [freightCharge, setFreightCharge] = useState<Partial<IFreightCharge>>(
    {},
  );
  const DownIcon = getIconsHandler(AppIconType.DOWN);
  const [showReceipt, setReceipt] = useState(false);
  const { currentVendorId } = useAuthorization();
  const { getBillDetailsHandler } = useContext(OrderContext);
  const totalWeight = useMemo(() => {
    return calculatePackageWeight(values?.itemsVendor);
  }, [values?.itemsVendor]);
  useEffect(() => {
    if (!values?.deliveryType) return;
    if (!showReceipt) return;
    (async () => {
      const data = await getBillDetailsHandler({
        vendor: currentVendorId || values?.vendor,
        deliveryType: values?.deliveryType,
        sourceCountry: values?.sourceCountry,
        destinationCountry: values?.destinationCountry,
        weight: totalWeight?.chargeableWeight,
        totalPackages: values?.itemsVendor?.length,
      });
      setFreightCharge(data);
    })();
  }, [values?.deliveryType, totalWeight, showReceipt]);

  return (
    <>
      <div
        className={
          "flex items-center gap-2 cursor-pointer text-black text-sm select-none"
        }
        onClick={() => setReceipt((e) => !e)}
      >
        <DownIcon />
        <span>View receipt</span>
      </div>
      {showReceipt && (
        <div className={`bg-white rounded-3xl p-4 flex flex-col gap-4`}>
          <div className={"font-semibold text-base"}>Receipt</div>
          <BillingAmountDetails
            charge={freightCharge}
            additionalCharge={values?.charges}
          />
        </div>
      )}
    </>
  );
};
export const ExtraChargesForm = () => {
  const { values } = useFormikContext<IUserPackageOrderPayload>();

  return (
    <>
      <FieldArray
        name={"charges"}
        render={({ push, remove, insert }) => {
          const TableColumns: ITableColumns<IPackageInvoiceItem>[] = [
            {
              title: "Title",
              render: (values, record, index) => {
                return (
                  <MyInput
                    inputSize={"middle"}
                    name={`charges.${index}.title`}
                    isRequired
                    placeholder={"Enter title"}
                  />
                );
              },
            },
            {
              title: "Description",
              ellipsis: true,
              render: (values, record, index) => {
                return (
                  <div className={""}>
                    <MyInput
                      placeholder={"Enter description"}
                      inputSize={"middle"}
                      name={`charges.${index}.description`}
                    />
                  </div>
                );
              },
            },
            {
              title: "Amount",
              ellipsis: true,
              render: (values, record, index) => {
                return (
                  <div className={""}>
                    <MyInput
                      placeholder={"0.00"}
                      inputType={"number"}
                      inputSize={"middle"}
                      name={`charges.${index}.amount`}
                    />
                  </div>
                );
              },
            },
            {
              title: "",
              render: (values, record, index) => {
                return (
                  <div className={"flex  gap-2"}>
                    <MyButton
                      size={"small"}
                      variant={"outlined"}
                      color={"red"}
                      iconType={AppIconType.DELETE}
                      onClick={() => remove(index)}
                    />
                    <MyButton
                      size={"small"}
                      variant={"outlined"}
                      color={"blue"}
                      iconType={AppIconType.ADD}
                      onClick={() => insert(index + 1, ChargesValues())}
                    />
                  </div>
                );
              },
            },
          ];
          if (values?.charges?.length < 1) {
            return (
              <div>
                <MyButton
                  color={"blue"}
                  variant={"filled"}
                  size={"middle"}
                  name={"Additional Charges"}
                  iconType={AppIconType.ADD}
                  onClick={() => push(ChargesValues())}
                />
              </div>
            );
          }
          return (
            <div className={`bg-white rounded-3xl p-4 flex flex-col gap-4`}>
              <div className={"font-semibold text-base"}>
                Additional Charges
              </div>
              <div className={"flex flex-col gap-2"}>
                <MyTable columns={TableColumns} data={values?.charges} />
              </div>
            </div>
          );
        }}
      />
    </>
  );
};

export const ApplyCouponForm = ({
  details,
  activityId,
}: {
  details: IOrder;
  activityId: string;
}) => {
  const DiscountIcon = getIconsHandler(AppIconType.DISCOUNT);
  const CloseIcon = getIconsHandler(AppIconType.CLOSE);
  const {
    options: { coupons },
  } = useContext(OptionContext);
  const { applyCouponHandler, getDetailsHandler, revokeCouponHandler } =
    useContext(ActivityContext);
  const { isUser } = useAuthorization();
  const onSubmit = async (values: any) => {
    if (!values?.coupon) return;
    await applyCouponHandler(activityId, values?.coupon, {
      onSuccess: async () => {
        await getDetailsHandler(activityId);
      },
    });
  };
  const onRevokeHandler = async () => {
    await revokeCouponHandler(activityId, {
      onSuccess: async () => {
        await getDetailsHandler(activityId);
      },
    });
  };
  if (details?.payment?.appliedCouponId?.code) {
    return (
      <div
        className={"flex items-center justify-between p-4 rounded-3xl bg-white"}
      >
        <div className={"flex items-center gap-1"}>
          <DiscountIcon className={"text-2xl text-success"} />
          <span className={"text-sm"}>Coupon applied</span>
        </div>
        <div className={"flex items-center gap-2"}>
          <span className={"uppercase text-sm font-medium"}>
            {details?.payment?.appliedCouponId?.code}
          </span>
          {isUser && (
            <CloseIcon
              onClick={() => onRevokeHandler()}
              className={"cursor-pointer text-gray-500"}
            />
          )}
        </div>
      </div>
    );
  }
  if (
    !isUser ||
    details?.payment?.hasPaid ||
    details?.status === PackageStatusEnum.CANCELLED
  ) {
    return <></>;
  }

  // filter applicable coupon
  const applicableCoupon = coupons?.filter(
    (coupon) =>
      coupon?.service === details?.vendor?.service &&
      (coupon?.forAllVendorUnderService ||
        coupon?.vendor?.some((e) => e?._id === details?.vendor?._id)),
  );

  return (
    <Formik initialValues={{ coupon: "" }} onSubmit={onSubmit}>
      {({ setFieldValue, handleSubmit }) => {
        const onSelectCoupon = async (code: string) => {
          await setFieldValue("coupon", code);
          handleSubmit();
        };
        return (
          <Form
            className={"flex flex-col gap-2 bg-white p-4 rounded-3xl w-full"}
          >
            <span className={"text-base font-semibold"}>Apply Promo</span>
            <div className={"bg-white grid grid-cols-[auto_80px] gap-2"}>
              <MyInput name={"coupon"} placeholder={"Coupon code"} />
              <MyButton
                htmlType={"submit"}
                type={"default"}
                color={"default"}
                name={"Apply"}
                variant={"solid"}
              />
            </div>
            <div className={"flex items-center flex-wrap gap-2  w-full"}>
              {applicableCoupon?.map((e) => {
                return (
                  <div
                    onClick={() => onSelectCoupon(e?.code)}
                    key={e?._id}
                    className={
                      "flex flex-col text-xs min-w-[200px] bg-ash-50 rounded-md p-1 px-2 cursor-pointer"
                    }
                  >
                    <div className={"flex items-center gap-2"}>
                      <div
                        className={
                          "w-3 h-3  border-2 border-gray-500 rounded-full"
                        }
                      ></div>
                      <span className={"uppercase text-sm font-medium"}>
                        {e?.code}
                      </span>
                    </div>
                    <span className={"text-ash-400"}>
                      {[
                        e?.discountType == CouponDiscountTypeEnum.FLAT && "Rs.",
                        e?.discount,
                        e?.discountType == CouponDiscountTypeEnum.PERCENTAGE &&
                          "%",
                        "discount",
                        e?.condition?.minimumSpendCondition > 0 &&
                          `for minimum order of Rs.${e?.condition?.minimumSpendCondition}`,
                      ]
                        ?.filter((e) => e)
                        ?.join(" ")}
                    </span>
                    <span className={"text-ash-400"}>
                      Valid till {moment(e?.validUntil).format("MMM DD, YYYY")}
                    </span>
                  </div>
                );
              })}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

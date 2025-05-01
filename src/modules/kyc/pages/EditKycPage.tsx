import React, { useContext, useEffect, useState } from "react";
import { MyFile, MyFormSubmitButton, MyInput, PageTemplate } from "components";
import { PageLinks } from "constant";
import { Form, Formik } from "formik";
import { KYCFormik } from "../helpers";
import { getGenderOptions, getKycDocumentTypeOptions } from "utils";
import { useAuthorization } from "hooks";
import { GenderEnum, KycStatusEnum } from "interfaces";
import { useNavigate } from "react-router-dom";
import { useAppContext, KycContext } from "context";
import moment from "moment";

function EditKYC() {
  const { getMyKycHandler, myKyc, isMyKycLoading, editHandler } =
    useContext(KycContext);
  const {
    handler: { getCurrentHandler },
  } = useAppContext();
  const navigate = useNavigate();
  const { kycStatus } = useAuthorization();
  const isSubmitted = kycStatus !== KycStatusEnum.NOT_SUBMITTED;
  const canEdit = ![KycStatusEnum.VERIFIED, KycStatusEnum.REJECTED].includes(
    kycStatus,
  );
  const [showEdit, setShowEdit] = useState(!isSubmitted || canEdit);

  useEffect(() => {
    (async () => {
      if (!isSubmitted) return;
      await getMyKycHandler();
    })();
  }, []);

  const onSubmit = async (values: any) => {
    await editHandler(values, {
      onSuccess: async () => {
        await getCurrentHandler();
        navigate(PageLinks.kyc.my);
      },
    });
  };

  return (
    <PageTemplate
      backLink={!isSubmitted ? PageLinks?.dashboard?.list : PageLinks.kyc.my}
      title={"Submit KYC"}
    >
      {isSubmitted && !showEdit ? (
        <div className="flex flex-col gap-4 border rounded-xl p-4 bg-white">
          <div className="text-gray-800 font-semibold text-lg">KYC Preview</div>
          <div className="text-sm text-gray-600">
            Name: {myKyc?.legalName || "-"}
          </div>
          <div className="text-sm text-gray-600">
            Gender: {myKyc?.gender || "-"}
          </div>
          <div className="text-sm text-gray-600">
            Document Type: {myKyc?.documentType || "-"}
          </div>
          <div className="text-sm text-gray-600">
            Date of Birth:{" "}
            {myKyc?.dateOfBirth
              ? moment(myKyc?.dateOfBirth).format("YYYY-MM-DD")
              : "-"}
          </div>
          {canEdit && (
            <div className="mt-2">
              <button
                onClick={() => setShowEdit(true)}
                className="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit My KYC
              </button>
            </div>
          )}
        </div>
      ) : (
        <Formik
          enableReinitialize
          initialValues={KYCFormik.initialValue(myKyc)}
          validationSchema={KYCFormik.validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="flex flex-col gap-6 mt-2 border rounded-xl bg-white p-5">
            <div className="flex flex-col items-center gap-4">
              <MyFile
                label="Profile Image"
                name="profileImage"
                className="w-full max-w-xs"
              />
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold text-base border-b pb-1">
                Personal Information
              </span>
              <MyInput
                name="legalName"
                label="Full Name"
                placeholder="Enter your full name"
                isRequired
              />
              <MyInput
                name="phone"
                label="Phone Number"
                placeholder="+977-98XXXXXXX"
                isRequired
              />
              <MyInput
                name="gender"
                radioOptions={getGenderOptions()}
                inputType="radio"
                label="Gender"
                isRequired
              />
              <MyInput
                name="dateOfBirth"
                inputType="date"
                label="Date of Birth"
                maxDate={moment().subtract(16, "year").toISOString()}
                isRequired
              />
              <div className="text-gray-400 text-xs -mt-3">
                You must be at least 16 years old.
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold text-base border-b pb-1">
                Document Details
              </span>
              <MyInput
                name="documentType"
                options={getKycDocumentTypeOptions()}
                inputType="select"
                label="Document Type"
                isRequired
              />
              <div className="grid grid-cols-2 gap-5">
                <MyFile name="frontImage" label="Front Image" isRequired />
                <MyFile name="backImage" label="Back Image" isRequired />
              </div>
            </div>

            <MyFormSubmitButton />
          </Form>
        </Formik>
      )}
    </PageTemplate>
  );
}

export default EditKYC;

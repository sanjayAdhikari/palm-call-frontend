import {
  GenderEnum,
  IKyc,
  KycDocumentTypeEnum,
  KycStatusEnum,
} from "interfaces";
import * as yup from "yup";

export const KYCFormik = {
  initialValue: (values?: Partial<IKyc>) => {
    return {
      legalName: values?.legalName || "",
      profileImage: values?.profileImage || "",
      gender: values?.gender || GenderEnum.MALE,
      dateOfBirth: values?.dateOfBirth,
      documentType: values?.documentType || KycDocumentTypeEnum.CITIZENSHIP,
      documentNumber: values?.documentNumber,
      frontImage: values?.frontImage,
      backImage: values?.backImage,
      issuedPlace: values?.issuedPlace,
      issuedDate: values?.issuedDate,
      expiryDate: values?.expiryDate,
    };
  },
  validationSchema: yup.object().shape({
    legalName: yup.string().required(" "),
    // profileImage: yup.string().required(" "),
    gender: yup.string().required(" "),
    // dateOfBirth: yup.string().required(" "),
    documentType: yup.string().required(" "),
    // documentNumber: yup.string().required(" "),
    frontImage: yup.string().required(" "),
    backImage: yup.string().required(" "),
    // issuedPlace: yup.string().required(" "),
    // issuedDate: yup.string().required(" "),
    // expiryDate: yup.string().required(" "),
  }),
};

export const KYC_MESSAGE: Record<
  KycStatusEnum,
  { title: string; description: string; color: string }
> = {
  NOT_SUBMITTED: {
    title: "Not Submitted",
    description:
      "Your KYC has not been submitted yet. Please complete the required details to proceed.",
    color: "#A0A0A0",
  },
  VERIFIED: {
    title: "Verified",
    description:
      "Your KYC has been successfully verified. You can now access all available features.",
    color: "#4CAF50",
  },
  REJECTED: {
    title: "Rejected",
    description:
      "Your KYC submission was rejected. Please review the details and try again.",
    color: "#F44336",
  },
  FAILED: {
    title: "Failed",
    description:
      "There was an error while processing your KYC. Please try submitting it again.",
    color: "#FF9800",
  },
  PENDING: {
    title: "Pending",
    description:
      "Your KYC submission is under review. We will notify you once the verification is complete.",
    color: "#FFC107",
  },
};

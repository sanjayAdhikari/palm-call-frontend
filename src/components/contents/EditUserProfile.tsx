import React, { useContext } from "react";
import { MyButton, MyFile, MyInput, MyModal } from "components";
import { Form, Formik } from "formik";
import { useAppContext, UtilityContext } from "context";
import * as yup from "yup";

function EditUserProfile({ onClose }: { onClose: any }) {
  const { editMyProfileHandler } = useContext(UtilityContext);
  const {
    userDetails,
    handler: { getCurrentHandler },
  } = useAppContext();
  const onSubmit = async (values: any) => {
    await editMyProfileHandler(values, {
      onSuccess: async () => {
        onClose();
        await getCurrentHandler();
      },
    });
  };
  return (
    <MyModal title={"Edit profile"} onCancel={onClose}>
      <Formik
        enableReinitialize
        initialValues={{
          profileImage: userDetails?.profileImage,
          name: userDetails?.name??"",
        }}
        validationSchema={yup.object().shape({
          name: yup.string().required(" "),
        })}
        onSubmit={onSubmit}
      >
        <Form className={"flex flex-col gap-4 mt-4"}>
          <div className={"flex flex-col gap-5"}>
            <div className={"flex items-center justify-center"}>
              <MyFile name={"profileImage"} isRequired />
            </div>
            <MyInput
              name={"name"}
              placeholder={"Enter your name"}
              isRequired
              label={"Name"}
            />
          </div>
          <MyButton name={"Submit"} htmlType={"submit"} />
        </Form>
      </Formik>
    </MyModal>
  );
}

export default EditUserProfile;

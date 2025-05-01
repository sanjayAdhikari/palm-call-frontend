import React, { useMemo } from "react";
import { useField } from "formik";

import { IFile } from "./ui.interface";
import { useAppContext } from "context";
import { useApiManager } from "hooks";
import { getIconsHandler } from "utils";
import { AppIconType } from "interfaces";
import { ViewFile } from "components";

export default function MyFile({ ...props }: IFile) {
  const [field, meta, helpers] = useField(props);
  const { uploadFileHandler, deleteFileHandler } = useApiManager();
  const value = field?.value;
  const shouldShowLabel = props?.label;
  const isError = meta?.error && meta?.touched;
  const {
    handler: { setLoading, setError },
  } = useAppContext();
  const AddIcon = getIconsHandler(AppIconType.ADD);
  const DeleteIcon = getIconsHandler(AppIconType.DELETE);
  // TODO: Handler multiple case.
  const changeHandler = async (e: any) => {
    try {
      setLoading(true);
      let file = e?.target?.files[0];
      const bodyFormData = new FormData();
      bodyFormData.append("imageTitle", field?.name);
      bodyFormData.append("file", file);
      const name = await uploadFileHandler(bodyFormData);
      helpers?.setValue(name);
      helpers?.setTouched(true);
    } catch (error) {
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteHandler = async (e: any) => {
    e?.stopPropagation();
    console.log("deleted");
    await deleteFileHandler(value);
    helpers?.setValue("");
  };
  const image = useMemo(() => {
    return field?.value;
  }, [field?.value]);
  return (
    <div className="flex flex-col items-start gap-2">
      {shouldShowLabel && (
        <label className="text-sm">
          {props?.label}{" "}
          {props?.isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <label>
        {value ? (
          <div className={"flex justify-center "}>
            <div className={"relative rounded-md h-[120px] w-[120px]"}>
              <ViewFile
                className={"max-h-[120px] max-w-[120px] rounded-md"}
                onError={() => {
                  helpers?.setValue("");
                }}
                name={[image]}
              />
              <div
                onClick={onDeleteHandler}
                className={
                  "absolute top-2 right-2 bg-red-600 p-2 text-white rounded-md cursor-pointer"
                }
              >
                <DeleteIcon />
              </div>
            </div>
          </div>
        ) : (
          <>
            <input
              hidden
              type={"file"}
              name={field?.name}
              onChange={changeHandler}
            />

            <div
              className={`${isError ? "border-red-500 text-red-500" : "text-gray-500"} cursor-pointer flex items-center justify-center w-[120px] h-[120px] border border-dotted bg-gray-50 rounded-md`}
            >
              <div className={"flex flex-col items-center"}>
                <AddIcon className={"text-[2rem] "} />
                <span>Upload</span>
              </div>
            </div>
          </>
        )}
      </label>
      {isError && (
        <span className="text-red-500 text-[0.8rem]">{meta.error}</span>
      )}
    </div>
  );
}

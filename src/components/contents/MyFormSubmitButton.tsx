import { MyButton } from "components";
import { useScreenSize } from "hooks";
import React from "react";

function MyFormSubmitButton({ label }: { label?: string }) {
  const { isSmScreen } = useScreenSize();
  return (
    <div className={"flex sm:justify-end justify-stretch border-t pt-5"}>
      <MyButton
        block={isSmScreen}
        htmlType={"submit"}
        name={label || "Submit"}
      />
    </div>
  );
}

export default MyFormSubmitButton;

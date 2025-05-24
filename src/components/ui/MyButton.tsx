import type { ButtonProps } from "antd";
import { Button } from "antd";
import { AppIconType } from "interfaces";
import React from "react";
import { getIconsHandler } from "utils";

interface IProps extends ButtonProps {
  iconType?: AppIconType;
}

function MyButton({ name, variant, iconType, iconPosition, ...props }: IProps) {
  const Icon = getIconsHandler(iconType);
  return (
    <Button
      {...props}
      color={props?.color || "default"}
      name={name}
      iconPosition={iconPosition || "start"}
      size={props?.size || "large"}
      variant={variant || "solid"}
      disabled={props?.disabled}
      icon={iconType && <Icon />}
    >
      {name}
    </Button>
  );
}

export default MyButton;

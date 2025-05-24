import type { ModalProps } from "antd";
import { Modal } from "antd";
import React from "react";

interface IProps extends ModalProps {}

function MyModal({ title, children, onCancel, width }: IProps) {
  return (
    <Modal
      open
      width={width}
      closable={typeof onCancel === "function"}
      footer={<></>}
      title={title}
      onCancel={(e) => onCancel(e)}
    >
      {children}
    </Modal>
  );
}

export default MyModal;

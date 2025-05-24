import { Segmented } from "antd";
import React from "react";

interface ISegmented {
  activeTab: string;
  tabs: { label: string | React.ReactNode; key: string }[];

  setActiveTab(value: string): void;
}

function MySegmented({ activeTab, tabs, setActiveTab }: ISegmented) {
  return (
    <Segmented
      size={"middle"}
      value={activeTab}
      onChange={(e) => {
        setActiveTab(e);
      }}
      options={tabs?.map((e) => {
        return {
          label: e?.label,
          value: e?.key,
        };
      })}
    />
  );
}

export default MySegmented;

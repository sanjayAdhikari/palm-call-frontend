import React from "react";
import { Segmented } from "antd";

interface ISegmented {
  activeTab: string;
  setActiveTab(value: string): void;
  tabs: { label: string | React.ReactNode; key: string }[];
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

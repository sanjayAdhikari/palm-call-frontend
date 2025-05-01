import React from "react";
import { Tabs } from "antd";

interface MyTabProps {
  tabBarExtraContent?: React.ReactNode;
  activeTab: string;
  setActiveTab(value: string): void;
  tabs: { label: string | React.ReactNode; key: string }[];
}
function MyTab({
  activeTab,
  tabs,
  tabBarExtraContent,
  setActiveTab,
}: MyTabProps) {
  return (
    <Tabs
      size={"middle"}
      type={"line"}
      tabBarExtraContent={tabBarExtraContent}
      activeKey={activeTab}
      onChange={setActiveTab}
      items={tabs?.map((e) => {
        return {
          ...e,
        };
      })}
    />
  );
}

export default MyTab;

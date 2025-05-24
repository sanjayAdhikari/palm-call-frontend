import { Tabs } from "antd";
import React from "react";

interface MyTabProps {
  tabBarExtraContent?: React.ReactNode;
  activeTab: string;
  tabs: { label: string | React.ReactNode; key: string }[];

  setActiveTab(value: string): void;
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

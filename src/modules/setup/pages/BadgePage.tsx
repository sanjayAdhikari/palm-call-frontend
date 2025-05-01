import React, { useContext, useEffect } from "react";
import { MyButton, MyMoreOption, MyTable, PageTemplate } from "components";
import { PageLinks } from "constant";
import { AppIconType, IBadge, IDeliveryType, ITableColumns } from "interfaces";
import { BadgeContext } from "../context";
import { useQueryParams } from "hooks";
import { useNavigate } from "react-router-dom";

function BadgePage() {
  const { isLoading, lists, getListHandler, toggleVisibility, deleteHandler } =
    useContext(BadgeContext);
  const { isActiveList } = useQueryParams();
  const navigate = useNavigate();

  const fetchHandler = async () => {
    await getListHandler({
      toggleStatus: isActiveList ? "on" : "off",
    });
  };
  useEffect(() => {
    (async () => {
      await fetchHandler();
    })();
  }, [isActiveList]);

  const TableColumns: ITableColumns<IBadge>[] = [
    {
      title: "S.N.",
      render: (value, record, index) => {
        return `${index + 1}.`;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "More",
      render: (value, record) => {
        return (
          <MyMoreOption
            items={[
              {
                label: record?.isActive ? "Inactive" : "Active",
                onClick: async () => {
                  await toggleVisibility(
                    record?._id,
                    record?.isActive ? "off" : "on",
                    {
                      onSuccess: async () => {
                        await fetchHandler();
                      },
                    },
                  );
                },
              },
              {
                label: "Edit",
                onClick: () => {
                  navigate(PageLinks.badge.edit(record?._id));
                },
              },
              {
                label: "Delete",
                onClick: async () => {
                  await deleteHandler(record?._id, {
                    onSuccess: async () => {
                      await fetchHandler();
                    },
                  });
                },
              },
            ]}
          />
        );
      },
    },
  ];
  return (
    <PageTemplate
      haveActiveInactiveSwitch
      backLink={PageLinks.dashboard.more}
      title={"Badge"}
      titleRightChildren={
        <>
          <MyButton
            name={"Add"}
            size={"middle"}
            variant={"outlined"}
            onClick={() => navigate(PageLinks.badge.create)}
            iconType={AppIconType.ADD}
          />
        </>
      }
    >
      <div>
        <MyTable
          isLoading={isLoading}
          columns={TableColumns}
          data={lists?.docs}
        />
      </div>
    </PageTemplate>
  );
}

export default BadgePage;

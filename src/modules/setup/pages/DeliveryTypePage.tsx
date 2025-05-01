import React, { useContext, useEffect } from "react";
import { MyButton, MyMoreOption, MyTable, PageTemplate } from "components";
import { PageLinks } from "constant";
import { AppIconType, IDeliveryType, ITableColumns } from "interfaces";
import { DeliveryTypeContext } from "../context";
import { useQueryParams } from "hooks";
import { useNavigate } from "react-router-dom";

function DeliveryTypePage() {
  const { isLoading, lists, getListHandler, toggleVisibility, deleteHandler } =
    useContext(DeliveryTypeContext);
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

  const TableColumns: ITableColumns<IDeliveryType>[] = [
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
                  navigate(PageLinks.deliveryType.edit(record?._id));
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
      title={"Delivery Type"}
      titleRightChildren={
        <>
          <MyButton
            size={"middle"}
            variant={"outlined"}
            name={"Create"}
            onClick={() => navigate(PageLinks.deliveryType.create)}
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

export default DeliveryTypePage;

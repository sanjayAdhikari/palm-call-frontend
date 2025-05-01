import React, { useContext, useEffect } from "react";
import { MyButton, MyMoreOption, MyTable, PageTemplate } from "components";
import { PageLinks } from "constant";
import { AppIconType, IBadge, ICommodity, ITableColumns } from "interfaces";
import { CommodityContext } from "../context";
import { useQueryParams } from "hooks";
import { useNavigate } from "react-router-dom";

function CommodityPage() {
  const { isLoading, lists, getListHandler, toggleVisibility, deleteHandler } =
    useContext(CommodityContext);
  const { isActiveList, getResponsiveBackLink } = useQueryParams();
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

  const TableColumns: ITableColumns<ICommodity>[] = [
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
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Fragile",
      render: (value, record) => {
        return record?.isFragile ? "Fragile" : "Non-fragile";
      },
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
                  navigate(PageLinks.commodity.edit(record?._id));
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
      backLink={getResponsiveBackLink()}
      title={"Commodity"}
      titleRightChildren={
        <>
          <MyButton
            name={"Add"}
            size={"middle"}
            variant={"outlined"}
            onClick={() => navigate(PageLinks.commodity.create)}
            iconType={AppIconType.ADD}
          />
        </>
      }
    >
      <div>
        <MyTable isLoading={isLoading} columns={TableColumns} data={lists} />
      </div>
    </PageTemplate>
  );
}

export default CommodityPage;

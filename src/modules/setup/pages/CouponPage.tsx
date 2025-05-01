import React, { useContext, useEffect } from "react";
import { MyButton, MyMoreOption, MyTable, PageTemplate } from "components";
import { PageLinks } from "constant";
import { AppIconType, IBadge, ICoupon, ITableColumns } from "interfaces";
import { CouponContext } from "../context";
import { useQueryParams } from "hooks";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function CouponPage() {
  const { isLoading, lists, getListHandler, toggleVisibility, deleteHandler } =
    useContext(CouponContext);
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

  const TableColumns: ITableColumns<ICoupon>[] = [
    {
      title: "S.N.",
      render: (value, record, index) => {
        return `${index + 1}.`;
      },
    },
    {
      title: "Code",
      render: (value, record, index) => {
        return <span className={"whitespace-nowrap"}>{record?.code}</span>;
      },
    },
    {
      title: "Valid From",
      render: (value, record, index) => {
        return (
          <span className={"whitespace-nowrap"}>
            {moment(record?.validFrom).format("YYYY-MM-DD hh:mm A")}
          </span>
        );
      },
    },
    {
      title: "Valid Until",
      render: (value, record, index) => {
        return (
          <span className={"whitespace-nowrap"}>
            {moment(record?.validUntil).format("YYYY-MM-DD hh:mm A")}
          </span>
        );
      },
    },
    {
      title: "Total Quantity",
      render: (value, record, index) => {
        return record?.totalQuantity;
      },
    },
    {
      title: "Available Quantity",
      render: (value, record, index) => {
        return record?.availableQuantity;
      },
    },
    {
      title: "Discount Amount",
      render: (value, record, index) => {
        return (
          <span className={"whitespace-nowrap"}>Rs. {record?.discount}</span>
        );
      },
    },
    {
      title: "Per customer usage",
      render: (value, record, index) => {
        return record?.perCustomerUsage;
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
                  navigate(PageLinks.coupon.edit(record?._id));
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
      title={"Coupon"}
      titleRightChildren={
        <>
          <MyButton
            size={"middle"}
            variant={"outlined"}
            onClick={() => navigate(PageLinks.coupon.create)}
            iconType={AppIconType.ADD}
            name={"Create"}
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

export default CouponPage;

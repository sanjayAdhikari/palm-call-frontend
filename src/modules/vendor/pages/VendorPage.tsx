import React, { useContext, useEffect } from "react";
import {
  MyButton,
  MyMoreOption,
  MyTable,
  PageTemplate,
  UserProfileCard,
} from "components";
import { PageLinks } from "constant";
import {
  AppIconType,
  ITableColumns,
  IVendor,
  UserType,
  VendorUserTypeEnum,
} from "interfaces";
import { VendorContext } from "context";
import { useQueryParams } from "hooks";
import { useNavigate } from "react-router-dom";

function VendorPage() {
  const { isLoading, lists, getListHandler, toggleVisibility, deleteHandler } =
    useContext(VendorContext);
  const navigate = useNavigate();
  const { goToWithReturnUrl, isActiveList } = useQueryParams();

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

  const TableColumns: ITableColumns<IVendor>[] = [
    {
      title: "S.N.",
      render: (value, record, index) => {
        return `${index + 1}.`;
      },
    },
    {
      title: "Name",
      render: (value, record, index) => {
        return (
          <UserProfileCard
            profile={record?.logo || record?.profileImage}
            name={{ first: record?.name }}
          />
        );
      },
    },
    {
      title: "Email",
      dataIndex: "primaryEmail",
    },
    {
      title: "Vendor ID",
      dataIndex: "vendorID",
      render: (value, record) => {
        return record?.vendorID || "N/A";
      },
    },
    {
      title: "Type",
      dataIndex: "vendorType",
      render: (value, record) => {
        return record?.vendorType ===
          VendorUserTypeEnum.INTERNATIONAL_CARGO_VENDOR
          ? "International Vendor"
          : "Domestic Vendor";
      },
    },
    {
      title: "Featured",
      render: (value, record, index) => {
        return record?.isFeatured ? "Featured" : "Non-featured";
      },
    },
    {
      title: "More",
      render: (value, record) => {
        return (
          <MyMoreOption
            items={[
              {
                label: "View",
                onClick: () => {
                  goToWithReturnUrl(
                    PageLinks.dashboard.userProfile(
                      UserType.INTERNATIONAL_CARGO_VENDOR,
                      record?._id,
                    ),
                  );
                },
              },
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
                  navigate(PageLinks.vendor.edit(record?._id));
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
      title={"Vendor"}
      titleRightChildren={
        <>
          <MyButton
            variant={"outlined"}
            name={"Add"}
            size={"middle"}
            onClick={() => navigate(PageLinks.vendor.create)}
            iconType={AppIconType.ADD}
          />
        </>
      }
    >
      <div>
        <MyTable
          onRowClickHandler={(data) => {
            goToWithReturnUrl(
              PageLinks.dashboard.userProfile(
                UserType.INTERNATIONAL_CARGO_VENDOR,
                data?._id,
              ),
            );
          }}
          isLoading={isLoading}
          columns={TableColumns}
          data={lists?.docs}
        />
      </div>
    </PageTemplate>
  );
}

export default VendorPage;

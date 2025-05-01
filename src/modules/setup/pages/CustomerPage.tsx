import { Tag } from "antd";
import { MyButton, MyTable, PageTemplate, UserProfileCard } from "components";
import { CustomerContext } from "context";
import { useQueryParams } from "hooks";
import { AppIconType, ITableColumns, IUser } from "interfaces";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSerialNumber } from "utils";

function CustomerPage() {
  const { isLoading, lists, getListHandler, currentPage } =
    useContext(CustomerContext);
  const { isActiveList } = useQueryParams();

  const fetchHandler = async (page?: number) => {
    await getListHandler({
      toggleStatus: isActiveList ? "on" : "off",
      page: page,
    });
  };
  useEffect(() => {
    (async () => {
      await fetchHandler(1);
    })();
  }, [isActiveList]);
  const { getResponsiveBackLink, goToWithReturnUrl } = useQueryParams();
  const navigate = useNavigate();
  const TableColumns: ITableColumns<IUser>[] = [
    {
      title: "S.N.",
      render: (value, record, index) => {
        return getSerialNumber(index, currentPage);
      },
    },
    {
      title: "Name",
      render: (value, record) => {
        return (
          <UserProfileCard profile={record?.profileImage} name={record?.name} />
        );
      },
    },
    {
      title: "Status",
      render: (value, record) => {
        return (
          <Tag color={record?.isEmailVerified ? "green" : "red"}>
            {record?.isEmailVerified ? "Verified" : "Unverified"}
          </Tag>
        );
      },
    },
    {
      title: "Email",
      render: (value, record) => {
        return record?.email;
      },
    },
    {
      title: "",
      render: (value, record) => {
        return (
          <div>
            <MyButton
              onClick={() => {
                // goToWithReturnUrl(
                //   PageLinks.dashboard.userProfile(UserType.USER, record?._id),
                // )
              }}
              name={"View"}
              size={"small"}
              color={"blue"}
              variant={"outlined"}
              iconPosition={"end"}
              iconType={AppIconType.RIGHT_ARROW}
            />
          </div>
        );
      },
    },
  ];
  return (
    <PageTemplate backLink={getResponsiveBackLink()} title={"Customers"}>
      <MyTable
        isLoading={isLoading}
        columns={TableColumns}
        data={lists?.docs}
        pagination={{
          currentPage: currentPage,
          onChange: async (page) => {
            await fetchHandler(page);
          },
          totalDocs: lists?.totalDocs,
        }}
      />
    </PageTemplate>
  );
}

export default CustomerPage;

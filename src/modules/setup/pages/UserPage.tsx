import { MyTable, PageTemplate, UserProfileCard } from "components";
import { useQueryParams } from "hooks";
import { IAdminUser, ITableColumns } from "interfaces";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context";

function UserPage() {
  const { isLoading, lists, getListHandler } = useContext(UserContext);
  const { isActiveList } = useQueryParams();

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
  const { getResponsiveBackLink } = useQueryParams();

  const TableColumns: ITableColumns<IAdminUser>[] = [
    {
      title: "S.N.",
      render: (value, record, index) => {
        return `${index + 1}.`;
      },
    },
    {
      title: "Name",
      render: (value, record) => {
        return <UserProfileCard user={record?.customer} />;
      },
    },
    {
      title: "Email",
      render: (value, record) => {
        return record?.customer?.email;
      },
    },
  ];
  return (
    <PageTemplate backLink={getResponsiveBackLink()} title={"Users"}>
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

export default UserPage;

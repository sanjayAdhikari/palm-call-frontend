import { Tag } from "antd";
import { MyButton, MyTable, PageTemplate, UserProfileCard } from "components";
import { ApiUrl, PageLinks } from "constant";
import { CustomerContext, useAppContext } from "context";
import { useAuthorization, useQueryParams } from "hooks";
import { AppIconType, ITableColumns, IUser } from "interfaces";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "services";
import { getIconsHandler, getSerialNumber } from "utils";
import GlobalAudioCall from "../../audio_call/GroupChat";
import { ChatContext } from "../../dashboard/context";

function CustomerPage() {
  const { userDetails } = useAuthorization();
  const NotificationIcon = getIconsHandler(AppIconType.NOTIFICATION);
  const { count } = useAppContext();

  const {
    isLoading,
    lists,
    getListHandler,
    currentPage,
    getDetailsHandler,
    details,
  } = useContext(CustomerContext);

  const {} = useContext(ChatContext);
  const { isActiveList } = useQueryParams();
  const { goToChatDetails } = useQueryParams();

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
  const navigate = useNavigate();
  const { getApi } = Api();

  const onThreadPreview = async (record: IUser) => {
    // get thread ID through participants
    const res = await getApi(
      ApiUrl.support.get_threadByParticipant(record._id),
    );
    console.log("response", res.data);
    if (res.data?._id) {
      goToChatDetails(res.data?._id);
    }
  };
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
        return <UserProfileCard profile={record?.profileImage} user={record} />;
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
                void onThreadPreview(record);
                // goToWithReturnUrl(
                //   PageLinks.dashboard.userProfile(UserType.USER, record?._id),
                // )
              }}
              name={"Chat"}
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
    <PageTemplate backLink={PageLinks.dashboard.chat}>
      <div className={"flex flex-col"}>
        <div className={"mb-10 flex items-center justify-between"}>
          <div className={"flex items-center gap-4"}>
            <GlobalAudioCall />
            <div className={"font-bold text-lg"}>Customers</div>
          </div>
          <div
            onClick={() => navigate(PageLinks.notification.list)}
            className={
              "relative bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-50"
            }
          >
            <NotificationIcon className={"text-[20px]"} />
            {count?.notificationCount > 0 && (
              <div
                className={
                  "absolute right-2 top-2 bg-red-600 h-3 w-3 rounded-full border border-white"
                }
              ></div>
            )}
          </div>
        </div>
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
      </div>
    </PageTemplate>
  );
}

export default CustomerPage;

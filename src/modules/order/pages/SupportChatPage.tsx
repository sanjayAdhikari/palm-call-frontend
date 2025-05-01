import React, { useContext, useEffect, useMemo, useRef } from "react";
import {
  AppIconType,
  ISupportChat,
  QueryNames,
  SupportChatStatusEnum,
  UserType,
} from "interfaces";
import { useSearchParams } from "react-router-dom";
import { useAuthorization, useQueryParams, useScreenSize } from "hooks";

import { PageLinks } from "constant";
import { SupportContext } from "../context";
import moment from "moment";
import { Form, Formik, FormikHelpers } from "formik";
import {
  MyButton,
  MyInput,
  MyMoreOption,
  PageTemplate,
  UserIconPlaceholder,
} from "components";

function SupportChatPage() {
  const [query] = useSearchParams();

  const { getDetailsHandler, isDetailsLoading, details, toggleVisibility } =
    useContext(SupportContext);

  const { isSmScreen } = useScreenSize();

  const activityId = query.get(QueryNames.ACTIVITY_ID);
  const threadId = query.get(QueryNames.THREAD_ID);
  const orderId = query.get(QueryNames.ORDER_ID);
  const fetchAPIHandler = async () => {
    await getDetailsHandler({
      ...(activityId && { activityID: activityId }),
      ...(orderId && { orderID: orderId }),
      ...(threadId && { threadID: threadId }),
    });
  };
  useEffect(() => {
    (async () => {
      if (!(threadId || activityId || orderId)) return;
      await fetchAPIHandler();
    })();
  }, [activityId, orderId, threadId]);
  const { goToActivityDetails } = useQueryParams();
  const { currentRole } = useAuthorization();
  const isUser = currentRole === UserType.USER;

  const Name = (() => {
    if (!details) return "Support";
    return !isUser
      ? `${details?.thread?.activity?.customer?.name?.first || ""} ${details?.thread?.activity?.customer?.name?.last || ""}`
      : details?.thread?.activity?.vendor?.name;
  })();
  return (
    <PageTemplate
      backLink={isSmScreen && PageLinks.support.list}
      title={
        <div className={"flex items-center gap-4"}>
          <UserIconPlaceholder />
          <span
            className={
              "sm:text-xl text-lg sm:w-[200px] w-[100px] truncate text-ellipsis"
            }
          >
            {Name}
          </span>
        </div>
      }
      titleRightChildren={
        <div className={"flex items-center"}>
          {details && (
            <MyButton
              iconType={AppIconType.PARCEL}
              size={"middle"}
              onClick={() =>
                goToActivityDetails(
                  isUser
                    ? details?.thread?.activity?._id
                    : details?.thread?.activity?.courier?.order?._id,
                )
              }
              variant={"text"}
              name={"Order"}
            />
          )}
          <MyButton
            iconType={AppIconType.REFRESH}
            size={"middle"}
            onClick={() => fetchAPIHandler()}
            variant={"text"}
          />
          `
          {!isUser &&
            details?.thread?.status === SupportChatStatusEnum.OPEN && (
              <MyMoreOption
                items={[
                  SupportChatStatusEnum.OPEN,
                  SupportChatStatusEnum.COMPLETED,
                  SupportChatStatusEnum.BLOCKED,
                ]
                  ?.filter((e) => e !== details?.thread?.status)
                  ?.map((status) => {
                    return {
                      label: status,
                      onClick: async () => {
                        await toggleVisibility(details?.thread?._id, status, {
                          onSuccess: async () => {
                            await fetchAPIHandler();
                          },
                        });
                      },
                    };
                  })}
              />
            )}
        </div>
      }
    >
      <div className={"h-full overflow-y-scroll"}>
        {isDetailsLoading ? (
          <div className={"text-center pt-2 "}>Loading...</div>
        ) : !details ? (
          <div className={"text-center pt-2"}>Something went wrong.</div>
        ) : (
          <>
            <ChatComponent details={details} />
          </>
        )}
      </div>
    </PageTemplate>
  );
}

const ChatComponent = ({ details }: { details: ISupportChat }) => {
  const { currentUserId } = useAuthorization();
  const { editHandler, deleteHandler } = useContext(SupportContext);
  const lastMessageRef = useRef(null);

  const onDeleteHandler = async (id: string) => {
    await deleteHandler(id);
  };

  const onSendMessageHandler = async (
    values: any,
    helpers: FormikHelpers<any>,
  ) => {
    if (!values?.message) return;
    await editHandler(values, {
      onSuccess: async () => {
        helpers?.resetForm({
          values: {
            threadID: details?.thread?._id,
            message: "",
          },
        });
      },
    });
  };
  const messages = useMemo(() => {
    return details?.messages?.docs.reverse();
  }, [details?.messages?.docs]);

  useEffect(() => {
    // Scroll to the last message on component mount
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]); // Trigger when messages update
  return (
    <div className="grid grid-rows-[auto_80px] gap-2 w-full h-full ">
      {/* Chat Box */}
      <div className="w-full flex flex-col gap-5 sm:p-4 p-2 h-full overflow-y-scroll">
        {messages.map((msg, index) => {
          const isMyMessage = msg?.sender?._id === currentUserId;
          const isLastMessage = index === messages.length - 1;
          return msg.systemGenerated ? (
            // System-generated message (centered)
            <div key={msg._id} className="text-center text-xs text-gray-500">
              {msg.message}
            </div>
          ) : (
            // User message
            <div
              ref={isLastMessage ? lastMessageRef : null} // Attach ref to last message
              key={msg._id}
              className={`flex flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
            >
              <div className={"flex items-center gap-2"}>
                {!isMyMessage && (
                  <div className={"text-xs text-[#9ca3af]"}>
                    {msg?.sender?.name?.first} {msg?.sender?.name?.last}
                  </div>
                )}
              </div>
              <div
                className={`text-sm ${isMyMessage ? "bg-[#1f2937] text-white" : "bg-ash-100 text-black"}   p-2 px-4 max-w-[400px] rounded-2xl`}
              >
                {msg.message}
              </div>
              <div className={"flex items-center gap-2"}>
                <div className="text-xs text-[#6b7280]">
                  {moment(msg.createdAt).format("DD MMMM    hh:mm A")}
                </div>
                {isMyMessage && (
                  <div
                    onClick={() => onDeleteHandler(msg?._id)}
                    className={"cursor-pointer text-xs text-gray-500"}
                  >
                    Delete
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Input Box */}
      <Formik
        initialValues={{ threadID: details?.thread?._id, message: "" }}
        onSubmit={onSendMessageHandler}
      >
        <Form className={"flex items-center gap-2"}>
          <div className={"w-full"}>
            <MyInput
              inputType={"text-area"}
              name={"message"}
              placeholder={"Enter message"}
              variant={"borderless"}
              autoSize
              className={"bg-ash-50 rounded-full px-5 text-sm w-full"}
            />
          </div>

          <div className={"flex items-center justify-center"}>
            <MyButton
              htmlType={"submit"}
              size={"middle"}
              iconType={AppIconType.SEND}
              variant={"solid"}
              className={"rounded-full"}
              color={"default"}
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default SupportChatPage;

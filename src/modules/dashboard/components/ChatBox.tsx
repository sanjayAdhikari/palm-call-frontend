import { MyButton, MyInput } from "components";
import { ApiUrl } from "constant";
import { Form, Formik, FormikHelpers } from "formik";
import { useAuthorization } from "hooks";
import { AppIconType, ISupportThread } from "interfaces";
import moment from "moment";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Api } from "services";
import { sendMessageViaSocket, sendTyping } from "../../../socket/socketClient";

import { ChatContext } from "../context";

const ChatBox = ({ thread }: { thread: ISupportThread }) => {
  const { currentUserId, userDetails } = useAuthorization();
  const { getApi } = Api();
  const { deleteHandler } = useContext(ChatContext);

  const topSentinelRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const pageSize = 20;

  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadMessages = useCallback(
    async (pageToLoad = 1) => {
      if (!thread?._id || isLoading || !hasMore) return;

      setIsLoading(true);
      try {
        const res = await getApi(
          `${ApiUrl.support.get_chat(
            thread._id,
          )}?page=${pageToLoad}&pageSize=${pageSize}`,
        );
        const newMessages = res?.data?.docs || [];
        setMessages((prev) => [...newMessages, ...prev]);
        setHasMore(newMessages.length === pageSize);
        setPage((prev) => prev + 1);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setIsLoading(false);
      }
    },
    [getApi, thread?._id, isLoading, hasMore],
  );

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    loadMessages(1);
  }, [thread?._id]);

  useEffect(() => {
    if (!topSentinelRef.current || !hasMore) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMessages(page);
        }
      },
      { threshold: 1 },
    );

    observerRef.current.observe(topSentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [page, loadMessages, hasMore]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleDelete = async (id: string) => {
    await deleteHandler(id);
  };

  const handleSend = async (values: any, helpers: FormikHelpers<any>) => {
    if (!values?.message) return;

    const messageText = values.message;
    const newMessage = {
      _id: `local-${Date.now()}`,
      sender: userDetails,
      message: messageText,
      createdAt: new Date().toISOString(),
      systemGenerated: false,
      attachments: [],
    };

    setMessages((prev) => [newMessage, ...prev]);
    helpers.resetForm();
    sendMessageViaSocket(thread._id, messageText);
  };

  const handleTyping = (val: string) => {
    if (val.trim()) {
      if (!isTyping) {
        sendTyping(thread._id, true); // start typing
        setIsTyping(true);
      }

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        sendTyping(thread._id, false); // stop typing after 1500ms of inactivity
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_auto] h-full w-full">
      {/* Message List */}
      <div className="overflow-y-auto flex flex-col-reverse p-4 gap-4">
        <div ref={topSentinelRef} />
        {messages.map((msg, i) => {
          const isMine = msg?.sender?._id === currentUserId;
          const isLast = i === messages.length - 1;

          return (
            <div
              key={msg._id}
              ref={isLast ? lastMessageRef : null}
              className={`flex flex-col gap-1 ${
                isMine ? "items-end" : "items-start"
              }`}
            >
              {!isMine && (
                <div className="text-xs text-gray-400">{msg?.sender?.name}</div>
              )}
              <div
                className={`text-sm px-4 py-2 rounded-2xl max-w-[400px] ${
                  isMine ? "bg-gray-800 text-white" : "bg-ash-100 text-black"
                }`}
              >
                {msg.message}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                {moment(msg.createdAt).format("DD MMM hh:mm A")}
                {isMine && (
                  <span
                    onClick={() => handleDelete(msg._id)}
                    className="cursor-pointer"
                  >
                    Delete
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <Formik
        initialValues={{ threadID: thread._id, message: "" }}
        onSubmit={handleSend}
      >
        <Form className="w-full flex items-center gap-2 p-2 border-t">
          <div className="flex-1">
            <MyInput
              name="message"
              inputType="text-area"
              placeholder="Enter message"
              variant="borderless"
              autoSize
              className="bg-ash-50 rounded-full px-5 text-sm w-full"
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
                }
              }}
            />
          </div>
          <MyButton
            htmlType="submit"
            size="middle"
            iconType={AppIconType.SEND}
            variant="solid"
            className="rounded-full"
            color="default"
          />
        </Form>
      </Formik>
    </div>
  );
};

export default ChatBox;

import { MyButton, MyInput } from "components";
import { ApiUrl } from "constant";
import { Form, Formik, FormikHelpers } from "formik";
import { useAuthorization } from "hooks";
import { AppIconType, ISupportThread, SocketEventEnum } from "interfaces";
import moment from "moment";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoChevronDown } from "react-icons/io5";
import { Api } from "services";
import {
  getSocket,
  sendMessageViaSocket,
  sendTyping,
} from "../../../socket/socketClient";
import { ChatContext } from "../context";

const ChatBox = ({ thread }: { thread: ISupportThread }) => {
  const { currentUserId, userDetails } = useAuthorization();
  const { getApi } = Api();
  const { deleteHandler } = useContext(ChatContext);

  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pageSize = 10;
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToBottom = () => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  const loadMessages = useCallback(
    async (pageToLoad = 1) => {
      if (!thread?._id || isLoading || !hasMore) return;

      setIsLoading(true);
      const scrollContainer = scrollRef.current;
      const prevHeight = scrollContainer?.scrollHeight ?? 0;

      try {
        const res = await getApi(
          `${ApiUrl.support.get_chat(
            thread._id,
          )}?page=${pageToLoad}&pageSize=${pageSize}`,
        );
        const newMessages = res?.data?.docs || [];

        setMessages((prev) => [...newMessages.reverse(), ...prev]);
        setHasMore(res?.data?.hasNextPage);
        setPage(res?.data?.nextPage ?? page + 1);

        setTimeout(() => {
          if (pageToLoad === 1) {
            scrollToBottom();
          } else {
            const newHeight = scrollContainer?.scrollHeight ?? 0;
            const diff = newHeight - prevHeight;
            scrollContainer?.scrollTo({ top: diff });
          }
        }, 0);
      } catch (err) {
        console.error("Failed to fetch messages", err);
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

    const socket = getSocket();

    const handleMessage = (msg: any) => {
      console.log("msg", msg);
      if (msg?.thread !== thread._id) return; // guard
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    socket.on(SocketEventEnum.MESSAGE, handleMessage);

    return () => {
      socket.off(SocketEventEnum.MESSAGE, handleMessage);
    };
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
    return () => observerRef.current?.disconnect();
  }, [page, loadMessages, hasMore]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        80;
      setShowScrollToBottom(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

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

    setMessages((prev) => [...prev, newMessage]);
    helpers.resetForm();
    sendMessageViaSocket(thread._id, messageText);
    scrollToBottom();
  };

  const handleTyping = (val: any) => {
    if (val.trim()) {
      if (!isTyping) {
        sendTyping(thread._id, true);
        setIsTyping(true);
      }

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        sendTyping(thread._id, false);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_auto] h-full w-full relative">
      <div
        ref={scrollRef}
        className="overflow-y-auto flex flex-col p-4 gap-4 scroll-smooth"
      >
        <div ref={topSentinelRef} />
        {messages.map((msg, i) => {
          const isMine = msg?.sender?._id === currentUserId;
          return (
            <div
              key={msg._id}
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
        <div ref={lastMessageRef} />
        {/* Ensure lastMessageRef is always at the end */}
      </div>

      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 bg-white border shadow-lg w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        >
          <IoChevronDown size={20} className="text-gray-700" />
        </button>
      )}

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

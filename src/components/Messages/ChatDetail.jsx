import { useUserInfo } from "@hooks/index";
import {
  useGetMessagesQuery,
  useMarkConversationAsSeenMutation,
} from "@services/messageApi";
import classNames from "classnames";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import MessageCreation from "./MessageCreation";
import { useRef } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useGetUserInfoByIdQuery } from "@services/userApi";
import UserAvatar from "@components/UserAvatar";
import { IconButton } from "@mui/material";
import { Videocam } from "@mui/icons-material";
import VideoCallRoom from "@components/VideoCall/VideoCallRoom";
import { useVideoCallContext } from "@context/VideoCallProvider";

const ChatDetail = () => {
  const { userId } = useParams();
  const { _id: currentUserId } = useUserInfo();
  const messageEndRef = useRef();
  const { startCall } = useVideoCallContext();

  const { data: partnerInfo } = useGetUserInfoByIdQuery(userId);

  const { data = { messages: [], pagination: {} } } = useGetMessagesQuery({
    userId,
    offset: 0,
    limit: 100,
  });
  const [markConversationAsSeen] = useMarkConversationAsSeenMutation();

  useEffect(() => {
    if (userId) {
      markConversationAsSeen(userId);

      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [markConversationAsSeen, userId]);

  const getGroupedMessages = (messages) => {
    const groupedByDate = messages.reduce((groups, msg) => {
      const date = dayjs(msg.createdAt).format("MM-DD-YYYY");

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(msg);
      return groups;
    }, {});

    const fullyGrouped = {};
    Object.entries(groupedByDate).forEach(([date, dateMessages]) => {
      fullyGrouped[date] = [];
      let groupedByMinutues = null;

      dateMessages.forEach((msg) => {
        const messageTime = dayjs(msg.createdAt);

        if (
          !groupedByMinutues ||
          groupedByMinutues.senderId !== msg.sender._id ||
          messageTime.diff(dayjs(groupedByMinutues.endTime), "minute") > 2
        ) {
          groupedByMinutues = {
            senderId: msg.sender._id,
            startTime: msg.createdAt,
            endTime: msg.createdAt,
            messages: [msg],
          };
          fullyGrouped[date].push(groupedByMinutues);
        } else {
          groupedByMinutues.messages.push(msg);
          groupedByMinutues.endTime = msg.createdAt;
        }
      });
    });

    return fullyGrouped;
  };

  const groupedMessages = useMemo(() => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return getGroupedMessages(data.messages);
  }, [data.messages]);

  console.log({ data, groupedMessages });
  return (
    <div className="card bg-dark-600 flex h-[calc(100vh-150px)] flex-col rounded-l-none pt-0">
      {partnerInfo && (
        <div className="border-dark-300 -mx-4 flex justify-between border-b bg-white px-7 py-3 shadow">
          <div className="flex items-center">
            <UserAvatar name={partnerInfo.fullName} src={partnerInfo.image} />
            <p className="ml-3 font-medium">{partnerInfo.fullName}</p>
          </div>
          <IconButton onClick={() => startCall(userId)}>
            <Videocam />
          </IconButton>
        </div>
      )}
      <div className="flex max-h-[calc(100%-65px)] flex-1 flex-col justify-between">
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto pt-4 pb-6">
          {Object.entries(groupedMessages).map(([date, groupsByMinutes]) => {
            console.log({ date, groupsByMinutes });
            return (
              <div key={date}>
                <div className="mb-2 flex justify-center">
                  <p className="bg-dark-100 rounded-full px-3 py-1 text-xs text-white">
                    {dayjs(date).format("MMMM D, YYYY")}
                  </p>
                </div>
                <div className="space-y-2">
                  {groupsByMinutes.map((group) => {
                    return (
                      <div key={group.startTime} className="space-y-0.5">
                        {group.messages.map((msg, index) => {
                          const isLastIndex =
                            index === group.messages.length - 1;
                          const isOwn = msg.sender._id === currentUserId;

                          return (
                            <div
                              key={msg._id}
                              className={classNames(
                                "flex",
                                isOwn ? "justify-end" : "justify-start",
                              )}
                            >
                              <div
                                className={classNames(
                                  "max-w-[70%] rounded-lg px-4 py-2",
                                  isOwn
                                    ? "bg-primary-main rounded-tr-none text-white"
                                    : "rounded-tl-none bg-white shadow",
                                )}
                              >
                                <p>{msg.message}</p>
                                {isLastIndex && (
                                  <p
                                    className={classNames(
                                      "mt-1 text-right text-xs",
                                      isOwn ? "text-white/80" : "text-dark-400",
                                    )}
                                  >
                                    {dayjs(msg.createdAt).format("HH:mm")}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div id="Testing" ref={messageEndRef} />
        </div>
        <MessageCreation userId={userId} messageEndRef={messageEndRef} />
      </div>
      <VideoCallRoom />
    </div>
  );
};
export default ChatDetail;

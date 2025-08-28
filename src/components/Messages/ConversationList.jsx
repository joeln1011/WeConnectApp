import TimeAgo from "@components/TimeAgo";
import UserAvatar from "@components/UserAvatar";
import { useUserInfo } from "@hooks/index";
import { Circle } from "@mui/icons-material";
import { useGetConversationsQuery } from "@services/messageApi";
import classNames from "classnames";
import { Link, useParams } from "react-router-dom";

const ConversationList = () => {
  const { data: conversations = [] } = useGetConversationsQuery();

  const { userId: activeUserId } = useParams();

  const { _id: currentUserId } = useUserInfo();
  console.log({ conversations });
  return (
    <div className="card flex h-[calc(100vh-150px)] flex-col overflow-y-auto rounded-r-none p-0">
      {conversations.map((conversation) => {
        const partner =
          conversation.sender._id === currentUserId
            ? conversation.receiver
            : conversation.sender;

        const isActive = activeUserId === partner._id;
        const isUnread =
          !conversation.seen && conversation.sender._id !== currentUserId;
        return (
          <Link to={`/messages/${partner._id}`} key={partner._id}>
            <div
              className={classNames(
                "relative flex items-center gap-2 px-4 py-2",
                {
                  "bg-primary-main text-white transition-all": isActive,
                },
              )}
            >
              <UserAvatar
                name={partner.fullName}
                src={partner.image}
                className={classNames({ "border-2 border-white": isActive })}
              />
              <div className="w-full">
                <div className="flex justify-between">
                  <p
                    className={classNames(
                      "font-semibold",
                      isUnread ? "font-extrabold" : "",
                    )}
                  >
                    {partner.fullName}
                  </p>
                  <TimeAgo
                    date={conversation.createdAt}
                    className={classNames("text-dark-400 text-xs", {
                      "text-white": isActive,
                      "font-medium": isUnread,
                    })}
                  />
                </div>
                <p
                  className={classNames("text-dark-400 text-sm", {
                    "text-white": isActive,
                    "font-medium text-black": isUnread,
                  })}
                >
                  {conversation.sender._id === currentUserId ? (
                    <span>You: </span>
                  ) : null}
                  {conversation.message}
                </p>
              </div>
              {isUnread && (
                <Circle className="text-primary-main absolute top-1/2 right-4 ml-1 !h-2 !w-2" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default ConversationList;

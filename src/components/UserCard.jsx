import {
  Check,
  Close,
  MessageOutlined,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
  useUnFriendMutation,
} from "@services/friendApi";
import { Link } from "react-router-dom";
import { socket } from "@context/SocketProvider";
import MyButton from "@components/Button";
import { Events } from "@libs/constants";
import UserAvatar from "./UserAvatar";

export function UserActionButtons({
  userId,
  isFriend,
  requestSent,
  requestReceived,
}) {
  const [sendFriendRequest, { isLoading: isAddingFriend }] =
    useSendFriendRequestMutation();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();
  const [unfriend, { isLoading: isUnfriending }] = useUnFriendMutation();
  if (isFriend) {
    return (
      <div className="flex gap-2">
        <div className="mt-2 flex items-center gap-2">
          <MyButton
            variant="outlined"
            size="small"
            onClick={async () => {
              try {
                await unfriend(userId).unwrap();
              } catch (e) {
                console.error("Unfriend failed", e);
              }
            }}
            disabled={isUnfriending}
          >
            {isUnfriending ? (
              <CircularProgress className="mr-1" size="16px" />
            ) : (
              <PersonRemove className="mr-1" fontSize="small" />
            )}
            Unfriend
          </MyButton>
          <MyButton
            variant="contained"
            size="small"
            inputProps={{ component: Link, to: `/messages/${userId}` }}
          >
            <MessageOutlined className="mr-1" fontSize="small" /> Message
          </MyButton>
        </div>
      </div>
    );
  }

  if (requestSent) {
    return (
      <MyButton variant="contained" size="small" disabled>
        <Check className="mr-1" fontSize="small" /> Request Sent
      </MyButton>
    );
  }

  if (requestReceived) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <MyButton
          variant="contained"
          size="small"
          onClick={() => acceptFriendRequest(userId)}
          icon={<Check className="mr-1" fontSize="small" />}
          isLoading={isAccepting}
        >
          Accept
        </MyButton>

        <MyButton
          variant="outlined"
          size="small"
          onClick={() => cancelFriendRequest(userId)}
          icon={<Close className="mr-1" fontSize="small" />}
          isLoading={isCanceling}
        >
          Cancel
        </MyButton>
      </div>
    );
  }

  return (
    <MyButton
      variant="outlined"
      onClick={async () => {
        await sendFriendRequest(userId).unwrap();
        socket.emit(Events.FRIEND_REQUEST_SENT, {
          receiverId: userId,
        });
      }}
      disabled={isAddingFriend}
    >
      {isAddingFriend ? (
        <CircularProgress className="mr-1 animate-spin" size="16px" />
      ) : (
        <PersonAdd className="mr-1" fontSize="small" />
      )}{" "}
      Add Friend
    </MyButton>
  );
}

const UserCard = ({
  id,
  isFriend,
  fullName = "",
  requestSent,
  requestReceived,
  avatarImage,
  isShowActionButtons = true,
}) => {
  return (
    <div className="card flex flex-col items-center">
      <UserAvatar
        className="mb-3 !h-12 !w-12"
        name={fullName}
        src={avatarImage}
      />
      <Link to={`/users/${id}`}>
        <p className="text-lg font-bold">{fullName}</p>
      </Link>
      {isShowActionButtons && (
        <div className="mt-4">
          <UserActionButtons
            userId={id}
            requestSent={requestSent}
            requestReceived={requestReceived}
            isFriend={isFriend}
          />
        </div>
      )}
    </div>
  );
};
export default UserCard;

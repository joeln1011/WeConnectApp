import { Check, Close, MessageOutlined, PersonAdd } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@services/friendApi";
import { Link } from "react-router-dom";

{
  /* <Button
  icon={<Logout fontSize="14px" />}
  inputProps={{ color: "error" }}
  variant="contained"
  size="small"
>
  Leave Group
</Button>; */
}
export function GroupActionButtons({
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
  if (isFriend) {
    return (
      <div className="flex gap-2">
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="contained"
            size="small"
            inputProps={{ component: Link, to: `/messages/${userId}` }}
          >
            <MessageOutlined className="mr-1" fontSize="small" /> Message
          </Button>
        </div>
      </div>
    );
  }

  if (requestSent) {
    return (
      <Button variant="contained" size="small" disabled>
        <Check className="mr-1" fontSize="small" /> Request Sent
      </Button>
    );
  }

  if (requestReceived) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="contained"
          size="small"
          onClick={() => acceptFriendRequest(userId)}
          icon={<Check className="mr-1" fontSize="small" />}
          isLoading={isAccepting}
        >
          Accept
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={() => cancelFriendRequest(userId)}
          icon={<Close className="mr-1" fontSize="small" />}
          isLoading={isCanceling}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outlined"
      //   onClick={async () => {
      //     await sendFriendRequest(userId).unwrap();
      //     socket.emit(Events.FRIEND_REQUEST_SENT, {
      //       receiverId: userId,
      //     });
      //   }}
      disabled={isAddingFriend}
    >
      {isAddingFriend ? (
        <CircularProgress className="mr-1 animate-spin" size="16px" />
      ) : (
        <PersonAdd className="mr-1" fontSize="small" />
      )}{" "}
      Add Friend
    </Button>
  );
}

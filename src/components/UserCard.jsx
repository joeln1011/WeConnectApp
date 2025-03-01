import { Check, Close, MessageOutlined, PersonAdd } from "@mui/icons-material";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { socket } from "@context/SocketProvider";
import MyButton from "@components/Button";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@services/friendApi";

const UserCard = ({
  id,
  isFriend,
  fullName = "",
  requestSent,
  requestReceived,
}) => {
  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();

  function getActionButtons() {
    if (isFriend) {
      return (
        <Button variant="contained" size="small">
          <MessageOutlined className="mr-1" fontSize="small" /> Message
        </Button>
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
        <div className="mt-2 space-x-1">
          <MyButton
            variant="contained"
            size="small"
            onClick={() => acceptFriendRequest(id)}
            icon={<Check className="mr-1" fontSize="small" />}
            isLoading={isAccepting}
          >
            Accept
          </MyButton>

          <MyButton
            variant="outlined"
            size="small"
            onClick={() => cancelFriendRequest(id)}
            icon={<Close className="mr-1" fontSize="small" />}
            isLoading={isCanceling}
          >
            Cancel
          </MyButton>
        </div>
      );
    }

    return (
      <Button
        variant="outlined"
        onClick={async () => {
          await sendFriendRequest(id).unwrap();
          socket.emit("friendRequestSent", {
            receiverId: id,
          });
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress className="mr-1 animate-spin" size="16px" />
        ) : (
          <PersonAdd className="mr-1" fontSize="small" />
        )}
        Add Friend
      </Button>
    );
  }

  return (
    <div className="card flex flex-col items-center">
      <Avatar className="!bg-primary-main mb-3 !h-12 !w-12">
        {fullName[0]?.toUpperCase()}
      </Avatar>
      <Link>
        <p className="text-lg font-bold">{fullName}</p>
      </Link>
      <div className="mt-4">{getActionButtons()}</div>
    </div>
  );
};
export default UserCard;

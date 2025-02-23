import { Check, Close, MessageOutlined, PersonAdd } from "@mui/icons-material";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { useSendFriendRequestMutation } from "@services/rootApi";
import { Link } from "react-router-dom";

const UserCard = ({
  id,
  isFriend,
  fullName = "",
  requestSent,
  requestReceived,
}) => {
  const [sentFriendRequest, { isLoading }] = useSendFriendRequestMutation();
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
        <div>
          <Button variant="contained" size="small">
            <Check className="mr-1" fontSize="small" /> Accept
          </Button>
          <Button variant="contained" size="small">
            <Close className="mr-1" fontSize="small" /> Cancel
          </Button>
        </div>
      );
    }
    return (
      <Button
        variant="outlined"
        onClick={() => sentFriendRequest(id)}
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
        {"Ben"[0]?.toUpperCase()}
      </Avatar>
      <Link>
        <p className="text-lg font-bold">{fullName}</p>
      </Link>
      <div className="!mt-4">{getActionButtons()}</div>
    </div>
  );
};

export default UserCard;

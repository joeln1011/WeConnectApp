import { socket } from "@context/SocketProvider";
import { Check, Close } from "@mui/icons-material";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetPendingFriendRequestsQuery,
} from "@services/friendApi";
import { useEffect } from "react";
import Button from "./Button";
import { Events } from "@libs/constants";
import UserAvatar from "./UserAvatar";

const FriendRequestItem = ({ fullName, id, userAvatarSrc }) => {
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();

  return (
    <div className="flex gap-2">
      <UserAvatar name={fullName} src={userAvatarSrc} />
      <div>
        <p className="font-bold">{fullName}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="contained"
            size="small"
            onClick={() => acceptFriendRequest(id)}
            icon={<Check className="mr-1" fontSize="small" />}
            isLoading={isAccepting}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => cancelFriendRequest(id)}
            icon={<Close className="mr-1" fontSize="small" />}
            isLoading={isCanceling}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const FriendRequests = () => {
  const { data = [], refetch } = useGetPendingFriendRequestsQuery();

  useEffect(() => {
    socket.on(Events.FRIEND_REQUEST_RECEIVED, (data) => {
      if (data.from) {
        refetch();
      }
    });

    return () => {
      socket.off(Events.FRIEND_REQUEST_RECEIVED);
    };
  }, [refetch]);

  console.log({ data });
  return (
    <div className="card">
      <p className="mb-4 font-bold">Friend Requests</p>
      <div className="space-y-4">
        {data.slice(0, 3).map((user) => (
          <FriendRequestItem
            key={user._id}
            fullName={user.fullName}
            id={user._id}
            userAvatarSrc={user.image}
          />
        ))}
      </div>
    </div>
  );
};
export default FriendRequests;

import { socket } from "@context/SocketProvider";
import { Check, Close } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import { useGetPendingFriendRequestsQuery } from "@services/rootApi";
import { useEffect } from "react";

const FriendRequestItem = ({ fullName }) => {
  return (
    <div className="flex gap-2">
      <Avatar className="!bg-primary-main">
        {fullName?.[0]?.toUpperCase()}
      </Avatar>
      <div>
        <p className="font-bold">{fullName}</p>
        <div className="mt-2 space-x-1">
          <Button variant="contained" size="small">
            <Check className="mr-1" fontSize="small" /> Accept
          </Button>
          <Button variant="outlined" size="small">
            <Close className="mr-1" fontSize="small" /> Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
const FriendRequests = () => {
  const { data = [], isFetching } = useGetPendingFriendRequestsQuery();
  useEffect(() => {
    socket.on("friendRequestReceived", (data) => {
      console.log("[friendRequestReceived]", { data });
    });
    return () => {
      socket.off("friendRequestReceived");
    };
  }, []);
  console.log({ data });
  return (
    <div className="card">
      <p className="mb-4 font-bold">Friend Request</p>
      <div className="space-y-4">
        {data.slice(0, 3).map((user) => (
          <FriendRequestItem
            key={user.id}
            fullName={user.fullName}
            id={user.id}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;

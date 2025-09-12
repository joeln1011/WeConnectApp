import {
  useLeaveGroupMutation,
  useRequestJoinGroupMutation,
} from "@services/groupApi";
import GroupCard from "./GroupCard";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@redux/slices/snackbarSlice";

const GroupList = ({ groups = [], title = "" }) => {
  const [requestJoinGroup, { isLoading: isJoining }] =
    useRequestJoinGroupMutation();
  const [leaveGroup, { isLoading: isLeaving }] = useLeaveGroupMutation();
  const dispatch = useDispatch();

  const handleJoinGroup = async (groupId, groupName) => {
    try {
      await requestJoinGroup(groupId).unwrap();
      dispatch(
        openSnackbar({
          message: `Successfully joined ${groupName}`,
        }),
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.message || "Failed to join group. Please try again.",
          severity: "error",
        }),
      );
    }
  };

  const handleLeaveGroup = async (groupId, groupName) => {
    try {
      await leaveGroup(groupId).unwrap();
      dispatch(
        openSnackbar({
          message: `Successfully left ${groupName}`,
        }),
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.message || "Failed to leave group. Please try again.",
          severity: "error",
        }),
      );
    }
  };

  return (
    <div>
      <p className="mb-4 text-xl font-bold">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(groups || []).map((group) => (
          <GroupCard
            id={group._id}
            key={group._id}
            name={group.name}
            description={group.description}
            isJoined={group.userMembership?.isMember}
            onJoinClick={handleJoinGroup}
            onLeaveClick={handleLeaveGroup}
            isJoining={isJoining}
            isLeaving={isLeaving}
            isOwner={group.userMembership?.role === "Owner"}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupList;

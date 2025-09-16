import Button from "@components/Button";
import { Check, Logout } from "@mui/icons-material";
import {
  useLeaveGroupMutation,
  useRequestJoinGroupMutation,
} from "@services/groupApi";

export function GroupActionButtons({ id, isMember, isRequestSent, role }) {
  const [requestJoinGroup, { isLoading: isRequestingJoinGroup }] =
    useRequestJoinGroupMutation();
  const [leaveGroup, { isLoading: isLeavingGroup }] = useLeaveGroupMutation();

  if (role === "Owner") return null;

  if (isMember) {
    return (
      <Button
        icon={<Logout fontSize="14px" />}
        inputProps={{ color: "error", fullWidth: true }}
        variant="contained"
        size="small"
        onClick={(e) => {
          e.preventDefault();
          leaveGroup(id);
        }}
        isLoading={isLeavingGroup}
      >
        Leave Group
      </Button>
    );
  }

  if (isRequestSent) {
    return (
      <Button
        variant="contained"
        size="small"
        disabled
        inputProps={{ fullWidth: true }}
      >
        <Check className="mr-1" fontSize="small" /> Request Sent
      </Button>
    );
  }

  return (
    <Button
      size="small"
      variant="contained"
      inputProps={{ fullWidth: true }}
      onClick={(e) => {
        e.preventDefault();
        requestJoinGroup(id);
      }}
      isLoading={isRequestingJoinGroup}
    >
      Join Group
    </Button>
  );
}

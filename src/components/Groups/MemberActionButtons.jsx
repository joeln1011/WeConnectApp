import { MoreVert, Person, PersonRemove } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useUpdateMemberMutation } from "@services/groupApi";
import { useState } from "react";
import { useDispatch } from "react-redux";

const ROLES = {
  Member: {
    value: "Member",
    label: "Member",
    level: 1,
    color: "text-gray-600",
  },
  Moderator: {
    value: "Moderator",
    label: "Moderator",
    level: 2,
    color: "text-green-600",
  },
  Admin: {
    value: "Admin",
    label: "Admin",
    level: 3,
    color: "text-blue-600",
  },
  Owner: {
    value: "Owner",
    label: "Owner",
    level: 4,
    color: "text-purple-600",
  },
};

const MemberActionButtons = ({
  currentUserRole,
  targetUserrole,
  targetUserId,
  groupId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [roleMenuEl, setRoleMenuEl] = useState(null);
  const [updateMemberRole] = useUpdateMemberMutation();
  const dispatch = useDispatch();
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setRoleMenuEl(null);
  };
  const canChangeRole = () => {
    if (currentUserRole === "Owner") {
      return targetUserrole !== "Owner";
    }
    if (currentUserRole === "Admin") {
      return ["Member", "Moderator"].includes(targetUserrole);
    }
    return false;
  };

  const canRemoveMember = () => {
    if (currentUserRole === "Owner") {
      return targetUserrole !== "Owner";
    }

    return false;
  };
  if (!canChangeRole() && !canRemoveMember()) return null;

  const getAvailableRoles = () => {
    if (currentUserRole === "Owner")
      return Object.values(ROLES).filter((r) => r.value !== "Owner");
    if (currentUserRole === "Admin")
      return Object.values(ROLES).filter((r) =>
        ["Moderator", "Member"].includes(r.value),
      );
    return [];
  };

  const handleRoleMenuOpen = (e) => {
    e.stopPropagation();
    setRoleMenuEl(e.currentTarget);
  };

  const handleRoleChange = async (newRole) => {
    try {
      await updateMemberRole({ groupId, userId: targetUserId, role: newRole });
      dispatch(
        openSnackbar({
          type: "success",
          message: "Role updated successfully",
        }),
      );
      handleMenuClose();
    } catch (err) {
      dispatch(
        openSnackbar({
          type: "error",
          message: err?.data?.message || err.message || "Failed to update role",
        }),
      );
    }
  };

  return (
    <div>
      <IconButton size="small" onClick={handleMenuClick}>
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {canChangeRole() && (
          <MenuItem onClick={handleRoleMenuOpen}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change Role</ListItemText>
          </MenuItem>
        )}
        {canRemoveMember() && (
          <MenuItem>
            <ListItemIcon>
              <PersonRemove fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>Change from Group</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <Menu
        anchorEl={roleMenuEl}
        open={Boolean(roleMenuEl)}
        onClose={() => setRoleMenuEl(null)}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Typography>Current:{targetUserrole}</Typography>
        </MenuItem>
        {getAvailableRoles()
          .filter((role) => role.value !== targetUserrole)
          .map((role) => (
            <MenuItem
              key={role.value}
              onClick={() => handleRoleChange(role.value)}
            >
              <ListItemText>
                <Typography className={role.color}>{role.label}</Typography>
              </ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default MemberActionButtons;

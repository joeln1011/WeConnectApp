import { MoreVert, Person, PersonRemove } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

const MemberActionButtons = ({ currentUserRole, targetUserrole }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <MenuItem>
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
    </div>
  );
};

export default MemberActionButtons;

import { MoreVert, Person, PersonRemove } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

const MemberActionButtons = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton size="small" onClick={() => {}}>
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
        <MenuItem>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Role</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PersonRemove fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Change from Group</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MemberActionButtons;

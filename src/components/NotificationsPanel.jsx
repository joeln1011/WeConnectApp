import { generateNotificationMessage } from "@libs/utils";
import { Circle, Notifications } from "@mui/icons-material";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useGetNotificationsQuery } from "@services/notificationApi";
import { useState } from "react";

const NotificationsPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data = {} } = useGetNotificationsQuery();
  console.log({ data });

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.target);
  };

  const newNotificationsCount =
    (data.notifications || []).filter((not) => !not.seen)?.length || 0;

  const renderNotificationsMenu = (
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
      classes={{ paper: "!min-w-80 !max-h-80 overflow-y-auto" }}
    >
      {(data?.notifications || []).map((notification) => (
        <MenuItem key={notification._id} className="flex !justify-between">
          <p>{generateNotificationMessage(notification)}</p>
          {!notification.seen && (
            <Circle fontSize="10px" className="text-primary-main" />
          )}
        </MenuItem>
      ))}
    </Menu>
  );
  return (
    <>
      <IconButton size="medium" onClick={handleNotificationClick}>
        <Badge badgeContent={newNotificationsCount || undefined} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      {renderNotificationsMenu}
    </>
  );
};
export default NotificationsPanel;

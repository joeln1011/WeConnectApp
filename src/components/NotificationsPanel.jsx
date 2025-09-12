import { Circle, Notifications } from "@mui/icons-material";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useGetNotificationsQuery } from "@services/notificationApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import UserAvatar from "./UserAvatar";

const NotificationItem = ({ notification, onClick }) => {
  if (
    notification.group &&
    notification.notificationType === "GROUP_JOIN_REQUEST"
  ) {
    return (
      <Link to={`/users/${notification.author?._id}`} onClick={onClick}>
        <div className="flex items-center gap-1">
          <UserAvatar
            name={notification.author?.fullName}
            src={notification.author?.image}
          />
          <div>
            <div>
              <p className="inline-block font-semibold">
                {notification.author?.fullName}
              </p>{" "}
              requested to join a group
            </div>
            <TimeAgo
              date={notification.createdAt}
              className="text-dark-400 -mt-[1px] text-xs"
            />
          </div>
        </div>
      </Link>
    );
  }

  if (notification.like)
    return (
      <Link to={`/users/${notification.author?._id}`} onClick={onClick}>
        <div className="flex items-center gap-1">
          <UserAvatar
            name={notification.author?.fullName}
            src={notification.author?.image}
          />
          <div>
            <div>
              <p className="inline-block font-semibold">
                {notification.author?.fullName}
              </p>{" "}
              liked a post
            </div>
            <TimeAgo
              date={notification.createdAt}
              className="text-dark-400 -mt-[1px] text-xs"
            />
          </div>
        </div>
      </Link>
    );
  if (notification.comment)
    return (
      <Link to={`/users/${notification.author?._id}`} onClick={onClick}>
        <div className="flex items-center gap-1">
          <UserAvatar
            name={notification.author?.fullName}
            src={notification.author?.image}
          />
          <div>
            <div>
              <p className="inline-block font-semibold">
                {notification.author?.fullName}
              </p>{" "}
              commented a post
            </div>
            <TimeAgo
              date={notification.createdAt}
              className="text-dark-400 -mt-[1px] text-xs"
            />
          </div>
        </div>
      </Link>
    );
  if (notification.message) {
    return (
      <Link to={`/messages/${notification.author?._id}`} onClick={onClick}>
        <div className="flex items-center gap-1">
          <UserAvatar
            name={notification.author?.fullName}
            src={notification.author?.image}
          />
          <div>
            <div>
              <p className="inline-block font-semibold">
                {notification.author?.fullName}
              </p>{" "}
              sent a message
            </div>
            <TimeAgo
              date={notification.createdAt}
              className="text-dark-400 -mt-[1px] text-xs"
            />
          </div>
        </div>
      </Link>
    );
  }
  return "";
};

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
          <NotificationItem
            notification={notification}
            onClick={handleMenuClose}
          />
          {!notification.seen && (
            <Circle className="text-primary-main ml-1 !h-2 !w-2" />
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

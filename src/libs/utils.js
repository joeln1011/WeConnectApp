// import { Circle } from "@mui/icons-material";

function generateNotificationMessage(notification) {
  if (notification.like) return `${notification.author?.fullName} liked a post`;
  if (notification.comment)
    return `${notification.author?.fullName} commented a post`;

  return "";

  // return (
  //   <div className="flex justify-between gap-2 items-center">
  //     {notification.like && <p>{notification.author?.fullName} liked a post</p>}
  //     {notification.comment && (
  //       <p>{notification.author?.fullName} commented a post</p>
  //     )}
  //     {!notification.seen && (
  //       <Circle fontSize="10px" className="text-primary-main" />
  //     )}
  //   </div>
  // );
}

export { generateNotificationMessage };

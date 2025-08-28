function generateNotificationMessage(notification) {
  if (notification.like) return `${notification.author?.fullName} liked a post`;
  if (notification.comment)
    return `${notification.author?.fullName} commented a post`;
  if (notification.message)
    return `${notification.author?.fullName} sent a message`;
  return "";
}

export { generateNotificationMessage };

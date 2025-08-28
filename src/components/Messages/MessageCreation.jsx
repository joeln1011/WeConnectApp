import Button from "@components/Button";
import { socket } from "@context/SocketProvider";
import { useNotifications } from "@hooks/index";
import { Events } from "@libs/constants";
import { TextField } from "@mui/material";
import { useSendMessageMutation } from "@services/messageApi";
import { useState } from "react";

const MessageCreation = ({ userId, messageEndRef }) => {
  const [newMessage, setNewMessage] = useState("");
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { createNotification } = useNotifications();

  const handleSubmit = async () => {
    const response = await sendMessage({
      message: newMessage,
      receiver: userId,
    }).unwrap();
    setNewMessage("");

    console.log({ response });
    socket.emit(Events.CREATE_MESSAGE, response);

    createNotification({
      postId: null,
      notificationType: "MESSAGE",
      notificationTypeId: response._id,
      receiverUserId: userId,
    });

    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newMessage) {
      e.preventDefault();
      handleSubmit();
    }
  };

  console.log("MessageCreation", { messageEndRef });

  return (
    <div className="card flex gap-2 p-2">
      <TextField
        className="flex-1"
        size="small"
        placeholder="Type your message here"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="contained"
        size="small"
        inputProps={{ disabled: !newMessage.trim() }}
        isLoading={isLoading}
        onClick={handleSubmit}
      >
        Send
      </Button>
    </div>
  );
};
export default MessageCreation;

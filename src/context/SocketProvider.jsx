import { Events } from "@libs/constants";
import { generateNotificationMessage } from "@libs/utils";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { rootApi } from "@services/rootApi";
import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

export const socket = io("https://api.holetex.com", {
  autoConnect: false,
  path: "/v1/we-connect/socket.io",
});

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useModalContext = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const token = useSelector((store) => store.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected to socket server");
    });

    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(Events.CREATE_NOTIFICATION_REQUEST, (data) => {
      console.log("[CREATE_NOTIFICATION_REQUEST]", { data });

      dispatch(
        rootApi.util.updateQueryData("getNotifications", undefined, (draft) => {
          let newData = { ...data };
          if (newData.userName) {
            newData.author = {
              _id: newData.userId,
              fullName: newData.userName,
              image: newData.userImage,
            };
          }
          draft.notifications.unshift(newData);
        }),
      );

      dispatch(
        openSnackbar({
          message: generateNotificationMessage(data),
          type: "info",
        }),
      );
    });

    socket.on(Events.SEND_MESSAGE, (data) => {
      console.log("[SEND_MESSAGE]", { data });

      dispatch(
        rootApi.util.updateQueryData(
          "getMessages",
          { userId: data.sender._id },
          (draft) => {
            draft.messages.push(data);
          },
        ),
      );

      dispatch(
        rootApi.util.updateQueryData("getConversations", undefined, (draft) => {
          let currentConversationIndex = draft.findIndex(
            (message) =>
              message.sender._id === data.sender._id ||
              message.receiver._id === data.sender._id,
          );

          console.log({ currentConversationIndex });

          if (currentConversationIndex !== -1) {
            draft.splice(currentConversationIndex, 1);
          }

          draft.unshift(data);
          // draft.messages.push(data);
        }),
      );
    });

    return () => {
      socket.off(Events.CREATE_NOTIFICATION_REQUEST);
    };
  }, [dispatch]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};
export default SocketProvider;

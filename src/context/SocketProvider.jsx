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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(Events.CREATE_NOTIFICATION_REQUEST, (data) => {
      console.log("[CREATE_NOTIFICATION_REQUEST]", { data });

      dispatch(
        rootApi.util.updateQueryData("getNotifications", undefined, (draft) => {
          draft.notifications.unshift(data);
        }),
      );

      dispatch(
        openSnackbar({
          message: generateNotificationMessage(data),
          type: "info",
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

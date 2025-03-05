import { socket } from "@context/SocketProvider";
import { useTheme } from "@emotion/react";
import {Events} from "@libs/constants"
import { useMediaQuery } from "@mui/material";
import { logOut as logOutAction } from "@redux/slices/authSlice";
import { useCreateNotificationMutation } from "@services/notificationApi";
import { useGetPostsQuery } from "@services/postApi";
import { throttle } from "lodash";
import { useMemo } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(logOutAction());
    navigate("/login", { replace: true });
  };

  return { logOut };
};

export const useUserInfo = () => {
  return useSelector((state) => state.auth.userInfo);
};

export const useDetectLayout = () => {
  const theme = useTheme();
  const isMediumLayout = useMediaQuery(theme.breakpoints.down("md"));

  return { isMediumLayout };
};

export const useLazyLoadPosts = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  // const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data = { ids: [], entities: [] },
    isFetching,
    refetch,
  } = useGetPostsQuery({ offset, limit });

  console.log("useLazyLoadPosts", { data, offset });

  const posts = data.ids.map((id) => data.entities[id]);

  const prevPostCountRef = useRef(0);

  useEffect(() => {
    if (!isFetching && data && hasMore) {
      const currentPostCount = data.ids.length;
      const newFetchedCount = currentPostCount - prevPostCountRef.current;
      if (newFetchedCount === 0) {
        setHasMore(false);
      } else {
        prevPostCountRef.current = currentPostCount;
      }
    }
  }, [data, isFetching, hasMore]);

  const loadMore = useCallback(async () => {
    setOffset((offset) => offset + limit);
  }, []);

  useEffect(() => {
    refetch();
  }, [offset, refetch]);

  useInfiniteScroll({
    hasMore,
    loadMore,
    isFetching,
  });

  return { isFetching, posts };
};

export const useInfiniteScroll = ({
  hasMore,
  loadMore,
  isFetching,
  threshold = 50,
  throttleMs = 500,
}) => {
  const handleScroll = useMemo(() => {
    return throttle(() => {
      const scrollTop = document.documentElement.scrollTop; // b
      const scrollHeight = document.documentElement.scrollHeight; // a
      const clientHeight = document.documentElement.clientHeight; // c

      if (!hasMore) {
        return;
      }

      if (clientHeight + scrollTop + threshold >= scrollHeight && !isFetching) {
        console.log("LOAD MOREEEEEEEE");
        loadMore();
      }
    }, throttleMs);
  }, [hasMore, isFetching, loadMore, threshold, throttleMs]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);
};

export const useNotifications = () => {
  const [createNotificationMutation] = useCreateNotificationMutation();
  const { _id: currentUserId } = useUserInfo();

  async function createNotification({
    receiverUserId,
    postId,
    notificationType,
    notificationTypeId,
  }) {
    if (receiverUserId === currentUserId) {
      return;
    }

    const notification = await createNotificationMutation({
      userId: receiverUserId,
      postId,
      notificationType,
      notificationTypeId,
    }).unwrap();

    socket.emit(Events.CREATE_NOTIFICATION, notification);
  }

  return { createNotification };
};

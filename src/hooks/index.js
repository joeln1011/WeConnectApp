import { socket } from "@context/SocketProvider";
import { useTheme } from "@emotion/react";
import { Events } from "@libs/constants";
import { useMediaQuery } from "@mui/material";
import { logOut as logOutAction } from "@redux/slices/authSlice";
import { useCreateNotificationMutation } from "@services/notificationApi";
import {
  useGetPostsByAuthorIdQuery,
  useGetPostsQuery,
} from "@services/postApi";
import { useGetMyGroupsQuery } from "@services/groupApi";

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

export const useLazyLoadPosts = ({ userId }) => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const {
    data: userProfileData = { ids: [], entities: [] },
    isFetching: userProfileFetching,
    refetch: userProfileRefetch,
  } = useGetPostsByAuthorIdQuery({ offset, limit, userId }, { skip: !userId });

  const {
    data: homeData = { ids: [], entities: [] },
    isFetching: homeIsFetching,
    refetch: homeRefetch,
  } = useGetPostsQuery({ offset, limit }, { skip: !!userId });

  const data = userId ? userProfileData : homeData;
  const isFetching = userId ? userProfileFetching : homeIsFetching;
  const refetch = userId ? userProfileRefetch : homeRefetch;

  console.log("useLazyLoadPosts", { data, offset });

  const posts = data.ids.map((id) => data.entities[id]);

  const prevPostCountRef = useRef(0);

  useEffect(() => {
    if (!isFetching && data && hasMore) {
      if (userId) {
        if (data.ids.length === data.meta?.total) {
          setHasMore(false);
        }
      } else {
        const currentPostCount = data.ids.length;
        const newFetchedCount = currentPostCount - prevPostCountRef.current;
        if (newFetchedCount === 0) {
          setHasMore(false);
        } else {
          prevPostCountRef.current = currentPostCount;
        }
      }
    }
  }, [data, isFetching, hasMore, userId]);

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

export const useLazyLoadMyGroups = ({ status = "Active", limit = 10 } = {}) => {
  const [offset, setOffset] = useState(0);
  const [groups, setGroups] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data = {}, isFetching } = useGetMyGroupsQuery({
    status,
    limit,
    offset,
  });

  useEffect(() => {
    const page = data.groups || [];
    if (!isFetching && Array.isArray(page)) {
      setGroups((prev) => {
        const seen = new Set(prev.map((g) => g._id));
        const merged = [...prev];
        page.forEach((g) => {
          if (g && !seen.has(g._id)) merged.push(g);
        });
        return merged;
      });
      if (page.length < limit) setHasMore(false);
    }
  }, [data, isFetching, limit]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) setOffset((o) => o + limit);
  }, [isFetching, hasMore, limit]);

  useEffect(() => {
    setGroups([]);
    setOffset(0);
    setHasMore(true);
  }, [status]);

  useInfiniteScroll({ hasMore, loadMore, isFetching });

  return { groups, isFetching, hasMore, loadMore };
};

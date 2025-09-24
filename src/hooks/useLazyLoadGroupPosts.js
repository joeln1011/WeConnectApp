import { useGetPostsByGroupIdQuery } from "@services/groupPostApi";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from ".";

export const useLazyLoadGroupPosts = ({ groupId }) => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const {
    data = { ids: [], entities: [] },
    isFetching,
    refetch,
  } = useGetPostsByGroupIdQuery({ offset, limit, groupId }, { skip: !groupId });

  console.log("useLazyLoadGroupPosts", { data, offset });

  const posts = data.ids.map((id) => data.entities[id]);

  useEffect(() => {
    if (!isFetching && data && hasMore) {
      if (data.ids.length === data.meta?.total) {
        setHasMore(false);
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

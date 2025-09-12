import Loading from "@components/Loading";
import UserCard from "@components/UserCard";
import { useGetFriendsByUserIdQuery } from "@services/friendApi";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

const FriendLists = () => {
  const { userId } = useParams();
  const { data, isFetching } = useGetFriendsByUserIdQuery(userId);

  const uniqueFriends = useMemo(() => {
    const seen = new Set();
    return (data?.friends || []).filter((u) => {
      if (!u?._id) return false;
      if (seen.has(u._id)) return false;
      seen.add(u._id);
      return true;
    });
  }, [data?.friends]);

  if (isFetching) return <Loading />;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {uniqueFriends.map((user) => (
          <UserCard
            id={user._id}
            key={user._id}
            fullName={user.fullName}
            avatarImage={user.image}
            isShowActionButtons={false}
          />
        ))}
      </div>
    </div>
  );
};
export default FriendLists;

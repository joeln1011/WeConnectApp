import Loading from "@components/Loading";
import UserCard from "@components/UserCard";
import { useGetFriendsByUserIdQuery } from "@services/friendApi";
import { useParams } from "react-router-dom";

const FriendLists = () => {
  const { userId } = useParams();
  const { data, isFetching } = useGetFriendsByUserIdQuery(userId);

  console.log("FriendLists", { data });

  if (isFetching) return <Loading />;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(data?.friends || []).map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
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

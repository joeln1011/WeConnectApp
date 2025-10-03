import Loading from "@components/Loading";
import { useGetGroupMembersQuery } from "@services/groupApi";
import { useParams } from "react-router-dom";
import GroupMemberCard from "./GroupMemberCard";
//import { useMemo } from "react";

const GroupMembers = () => {
  const { groupId } = useParams();
  const { data, isFetching } = useGetGroupMembersQuery(groupId);

  // const uniqueFriends = useMemo(() => {
  //   const seen = new Set();
  //   return (data?.friends || []).filter((u) => {
  //     if (!u?._id) return false;
  //     if (seen.has(u._id)) return false;
  //     seen.add(u._id);
  //     return true;
  //   });
  // }, [data?.friends]);

  if (isFetching) return <Loading />;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(data?.members || []).map(({ user, role }) => (
          <GroupMemberCard
            id={user._id}
            key={user._id}
            fullName={user.fullName}
            avatarImage={user.image}
            role={role}
          />
        ))}
      </div>
    </div>
  );
};
export default GroupMembers;

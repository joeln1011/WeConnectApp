import GroupCard from "./GroupCard";
import { useGetGroupsQuery } from "@services/groupApi";

const GroupExplore = () => {
  const {
    data = {},
    isLoading,
    error,
  } = useGetGroupsQuery({
    limit: 10,
    offset: 0,
    searchQuery: "",
  });
  return (
    <div>
      <p className="mb-4 text-xl font-bold">Explore</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(data.groups || []).map((group) => (
          <GroupCard key={group._id} groupInfo={group} />
        ))}
      </div>
    </div>
  );
};

export default GroupExplore;

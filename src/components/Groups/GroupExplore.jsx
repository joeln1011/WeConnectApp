import { useGetGroupsQuery } from "@services/groupApi";
import GroupList from "./GroupList";

const GroupExplore = () => {
  const { data = {} } = useGetGroupsQuery({
    limit: 10,
    offset: 0,
    searchQuery: "",
  });
  return <GroupList groups={data.groups} title="Explore" />;
};

export default GroupExplore;

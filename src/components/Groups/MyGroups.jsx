import { useGetMyGroupsQuery } from "@services/groupApi";
import GroupList from "./GroupList";

const MyGroups = () => {
  const { data = {} } = useGetMyGroupsQuery({
    status: "Active",
    limit: 10,
    offset: 0,
  });
  return <GroupList groups={data.groups} title="My Groups" />;
};

export default MyGroups;

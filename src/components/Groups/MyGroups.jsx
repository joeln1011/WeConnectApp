import GroupList from "./GroupList";
import { useLazyLoadMyGroups } from "@hooks";

const MyGroups = () => {
  const { groups } = useLazyLoadMyGroups({ status: "Active", limit: 10 });
  return <GroupList groups={groups} title="My Groups" />;
};

export default MyGroups;

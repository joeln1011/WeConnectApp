import GroupPostList from "./GroupPostList";
import { useOutletContext } from "react-router-dom";

const GroupDiscussion = () => {
  const { groupId } = useOutletContext();
  return (
    <div>
      <GroupPostList groupId={groupId} />
    </div>
  );
};

export default GroupDiscussion;

import { useOutletContext } from "react-router-dom";
import GroupPostList from "./GroupPostList";
import PostCreation from "./PostCreation";

const GroupDiscussion = () => {
  const { groupId } = useOutletContext();
  return (
    <div className="space-y-4">
      <PostCreation />
      <GroupPostList groupId={groupId} />
    </div>
  );
};

export default GroupDiscussion;

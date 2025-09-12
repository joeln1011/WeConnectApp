import GroupCard from "./GroupCard";

const GroupList = ({ groups = [], title = "" }) => {
  return (
    <div>
      <p className="mb-4 text-xl font-bold">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(groups || []).map((group) => (
          <GroupCard key={group._id} groupInfo={group} />
        ))}
      </div>
    </div>
  );
};

export default GroupList;

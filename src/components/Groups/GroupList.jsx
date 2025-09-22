import GroupCard from "./GroupCard";

const GroupList = ({ groups = [], title = "" }) => {
  return (
    <div>
      <p className="mb-4 text-xl font-bold">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(groups || []).map((group) => (
          <GroupCard
            id={group._id}
            key={group._id}
            name={group.name}
            coverImage={group.coverImage}
            description={group.description}
            isMember={group.userMembership.isMember}
            isRequestSent={group.userMembership?.status === "Pending"}
            role={group.userMembership?.role}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupList;

import UserAvatar from "@components/UserAvatar";
import { Link } from "react-router-dom";

const GroupMemberCard = ({ id, fullName = "", avatarImage, role }) => {
  return (
    <div className="card flex flex-col items-center">
      <UserAvatar
        className="mb-3 !h-12 !w-12"
        name={fullName}
        src={avatarImage}
      />
      <Link to={`/users/${id}`}>
        <p className="text-lg font-bold">{fullName}</p>
      </Link>
      <p className="text-sm text-gray-500">Role: {role}</p>
    </div>
  );
};
export default GroupMemberCard;

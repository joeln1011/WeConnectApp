import UserAvatar from "@components/UserAvatar";
import { useUserInfo } from "@hooks/index";
import { Link } from "react-router-dom";
import MemberActionButtons from "./MemberActionButtons";

const GroupMemberCard = ({ id, fullName = "", avatarImage, role }) => {
  const { _id } = useUserInfo();
  const isMyself = _id === id;
  return (
    <div className="card relative flex flex-col items-center">
      {!isMyself && (
        <div className="absolute top-2 right-2">
          <MemberActionButtons />
        </div>
      )}
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

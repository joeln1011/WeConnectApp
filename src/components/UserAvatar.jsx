import { useUserInfo } from "@hooks/index";
import { Avatar } from "@mui/material";

const UserAvatar = ({ className, isMyAvatar = false, name, src }) => {
  const { fullName, image } = useUserInfo();

  const userName = isMyAvatar ? fullName : name;
  const avatarImage = isMyAvatar ? image : src;

  return (
    <Avatar className={`!bg-primary-main ${className}`} src={avatarImage}>
      {userName?.[0]?.toUpperCase()}
    </Avatar>
  );
};
export default UserAvatar;

import UserCard from "@components/UserCard";
//import { useUserInfo } from "@hooks/index";
import { useSearchUsersQuery } from "@services/rootApi";
import { useLocation } from "react-router-dom";

const SearchUserPage = () => {
  const location = useLocation();
  //const { _id } = useUserInfo();
  const { data } = useSearchUsersQuery({
    limit: 10,
    offset: 0,
    searchQuery: location?.state?.searchTerm,
  });
  console.log({ data });
  return (
    <div className="container flex-col">
      <p className="text-xl font-bold">Search</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(data?.users || []).map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            fullName={user.fullName}
            isFriend={user.isFriend}
            requestSent={user.requestSent}
            requestRecieved={user.requestRecieved}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchUserPage;

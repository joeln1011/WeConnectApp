import FriendRequests from "@components/FriendRequests";
import PostCreation from "@components/PostCreation";
import PostList from "@components/PostList";
import Sidebar from "@components/SideBar";

function HomePage() {
  return (
    <div className="container">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-4">
        <PostCreation />
        <PostList />
      </div>
      <div className="hidden w-72 sm:block">
        <FriendRequests />
      </div>
    </div>
  );
}

export default HomePage;

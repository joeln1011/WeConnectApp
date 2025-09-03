import GroupSidebar from "@components/Groups/GroupSidebar";
import { Outlet } from "react-router-dom";

function GroupPage() {
  return (
    <div className="container">
      <GroupSidebar />
      <div className="flex flex-1 flex-col gap-4">
        <Outlet />
      </div>
    </div>
  );
}

export default GroupPage;

import GroupSidebar from "@components/Groups/GroupSidebar";

function GroupPage() {
  return (
    <div className="container">
      <GroupSidebar />
      <div className="flex flex-1 flex-col gap-4">
        <p>Content</p>
      </div>
    </div>
  );
}

export default GroupPage;

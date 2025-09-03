import styled from "@emotion/styled";
import { useDetectLayout } from "@hooks/index";
import { ExploreOutlined, GroupOutlined } from "@mui/icons-material";
import { Drawer, List } from "@mui/material";
import { toggleDrawer } from "@redux/slices/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ListStyled = styled(List)`
  padding: 16px;
  border-radius: 4px;
  gap: 4px;
`;

const SidebarContent = () => {
  return (
    <div className="flex w-64 flex-col gap-4">
      <ListStyled className="card flex flex-col">
        <Link to="explore" className="flex items-center gap-1">
          <ExploreOutlined fontSize="small" />
          Explore
        </Link>
        <Link to="my-groups" className="flex items-center gap-1">
          <GroupOutlined fontSize="small" />
          My Groups
        </Link>
      </ListStyled>
    </div>
  );
};

const GroupSidebar = () => {
  const { isMediumLayout } = useDetectLayout();
  const isShowDrawer = useSelector((store) => store.settings.isShowDrawer);
  const dispatch = useDispatch();

  return isMediumLayout ? (
    <Drawer
      open={isShowDrawer}
      onClose={() => dispatch(toggleDrawer())}
      classes={{ paper: "p-4 flex flex-col gap-4 !bg-dark-200" }}
    >
      <div>
        <Link to="/">
          <img src="/weconnect-logo.png" className="h-8 w-8" />
        </Link>
      </div>
      <SidebarContent />
    </Drawer>
  ) : (
    <SidebarContent />
  );
};
export default GroupSidebar;

import styled from "@emotion/styled";
import { useDetectLayout, useUserInfo } from "@hooks/index";
import {
  HomeOutlined,
  Hub,
  Lock,
  Message,
  People,
  Translate,
} from "@mui/icons-material";
import { Drawer, List, ListSubheader } from "@mui/material";
import { toggleDrawer } from "@redux/slices/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ListStyled = styled(List)`
  padding: 16px;
  border-radius: 4px;
  gap: 4px;
`;

const SidebarContent = () => {
  const { _id } = useUserInfo();

  return (
    <div className="flex w-64 flex-col gap-4">
      <ListStyled className="card flex flex-col">
        <Link to="/" className="flex items-center gap-1">
          <HomeOutlined fontSize="small" /> New Feeds
        </Link>
        <Link to="/messages" className="flex items-center gap-1">
          <Message fontSize="small" /> Messenger
        </Link>
        <Link to={`/users/${_id}/friends`} className="flex items-center gap-1">
          <People fontSize="small" /> Friends
        </Link>
        <Link to="/groups" className="flex items-center gap-1">
          <Hub fontSize="small" /> Groups
        </Link>
      </ListStyled>

      <ListStyled className="card flex flex-col">
        <ListSubheader className="mb-2 !px-0 !leading-none">
          Settings
        </ListSubheader>
        <Link to="/settings/account" className="flex items-center gap-1">
          <Lock fontSize="small" /> Account
        </Link>
        <Link to="/settings/languages" className="flex items-center gap-1">
          <Translate fontSize="small" /> Languages
        </Link>
      </ListStyled>
    </div>
  );
};

const Sidebar = () => {
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
export default Sidebar;

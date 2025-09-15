import { Tab, Tabs } from "@mui/material";
import { theme } from "@configs/muiConfig";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useGetGroupDetailQuery } from "@services/groupApi";
import Button from "@components/Button";
import { Logout } from "@mui/icons-material";
import { GroupActionButtons } from "./GroupActionButtons";

function GroupDetail() {
  const { groupId } = useParams();
  const location = useLocation();

  const { data = {}, isLoading, isFetching } = useGetGroupDetailQuery(groupId); // useGetGroupDetailQuery(groupId);

  console.log("GROUP INFO", data);

  const TABS = [
    {
      path: "discussion",
      label: "Discussion",
      index: 0,
    },
    {
      path: "members",
      label: "Members",
      index: 1,
    },
  ];

  const getActiveTabIndex = (pathname) => {
    if (pathname === `/groups/${groupId}`) return 0;

    const lastSegment = pathname.split("/").filter(Boolean).pop();
    const matchedTab = TABS.find((tab) => tab.path === lastSegment);

    return matchedTab ? matchedTab.index : 0;
  };

  const currentTabIndex = getActiveTabIndex(location.pathname);
  const isMember = data.userMembership?.isMember;
  return (
    <div className="flexflex-col">
      <div className="card relative p-0">
        <img
          className="h-36 w-full object-cover sm:h-80"
          src={data.coverImage ?? "https://placehold.co/1920x540"}
        />
        <div className="flex justify-between gap-2 p-6">
          <div>
            <p className="text-2xl font-bold">{data.name}</p>
            <p>
              {data.memberCount}
              {data.memberCount === 1 ? " member" : "members"}
            </p>
          </div>
          <div>
            <GroupActionButtons />
          </div>
        </div>
        {isMember ? (
          <div>
            <div className="border-dark-300 border-t px-6 py-2">
              <Tabs
                value={currentTabIndex}
                sx={{
                  "&& .Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    borderRadius: "5px",
                  },
                  "&& .MuiTabs-indicator": {
                    display: "none",
                  },

                  "&& .MuiTab-root": {
                    minHeight: "auto",
                  },

                  "&& .MuiTabs-scroller": {
                    marginTop: "4px",
                  },
                }}
              >
                {TABS.map((tab) => {
                  console.log({ tab });
                  return (
                    <Tab
                      key={tab.path}
                      label={tab.label}
                      LinkComponent={Link}
                      to={`/groups/${groupId}/${tab.path}`}
                    />
                  );
                })}
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="border-dark-300 border-t px-6 py-2">
            <p>
              Join this group to participate in discussions and connect with
              members.
            </p>
          </div>
        )}
      </div>
      {isMember && (
        <div className="flex">
          <div className="flex-3">
            <Outlet context={{ userData: data }} />
          </div>
          <div className="flex-1">Right side bar</div>
        </div>
      )}
    </div>
  );
}

export default GroupDetail;

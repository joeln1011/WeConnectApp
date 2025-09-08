import { random } from "lodash";
import GroupCard from "./GroupCard";

const GroupExplore = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[1, 2, 3].map(() => (
        <GroupCard key={random()} />
      ))}
    </div>
  );
};

export default GroupExplore;

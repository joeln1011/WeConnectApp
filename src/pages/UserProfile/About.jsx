import PostCreation from "@components/PostCreation";
import PostList from "@components/PostList";
import { useOutletContext, useParams } from "react-router-dom";

const About = () => {
  const { userId } = useParams();
  const { userData, isMyProfile } = useOutletContext();

  return (
    <div className="flex gap-4">
      <div className="hidden flex-[2] space-y-4 sm:block">
        <div className="card">
          <p className="mb-3 text-lg font-bold">Introduction</p>
          <p>{userData.about}</p>
        </div>
        <div className="card">
          <p className="mb-3 text-lg font-bold">Photo</p>
        </div>
      </div>
      <div className="flex-[3]">
        <div className="flex flex-1 flex-col gap-4">
          {isMyProfile && <PostCreation />}
          <PostList userId={userId} key={userId} />
        </div>
      </div>
    </div>
  );
};
export default About;

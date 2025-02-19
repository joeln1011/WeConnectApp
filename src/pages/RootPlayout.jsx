import { Outlet } from "react-router-dom";
import { Suspense } from "react";
// Supports weights 100-900
import "@fontsource-variable/public-sans";

const RootPlayout = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading</p>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootPlayout;

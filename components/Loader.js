import React from "react";
import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="w-full flex items-center justify-center text-[oklch(0.785 0 0)] bg-[oklch(0.785 0 0)] min-h-screen">
      <HashLoader size={100} color="oklch(0.985 0 0)" />
    </div>
  );
};

export default Loader;

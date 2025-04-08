import React from "react";
import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <HashLoader size={100} color="oklch(0.985 0 0)" />
    </div>
  );
};

export default Loader;

"use client"
import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
  return (
    <div>
      <div className="border rounded-lg flex items-center justify-center outline-none">
        <button className="flex gap-2 items-center justify-center w-full h-full py-4 rounded-lg">
          <FcGoogle className="text-2xl" />
          <span className="font-semibold  ">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default GoogleSignIn;

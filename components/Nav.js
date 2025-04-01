import React from "react";
import { Button } from "./ui/button";
import OpenAI from "@/public/OpenAI-white.svg";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-4 h-2xl mb-[6rem] max-md:mb-[4rem] ">
      <div>
        <Image src={OpenAI} height={50} width={50} alt="logo" className="" />
      </div>
      <div className="flex gap-4">
        <Button variant={"secondary"} className={`cursor-pointer`}>Login</Button>
        <Button className={`cursor-pointer`}>Sign Up</Button>
      </div>
    </nav>
  );
};

export default Nav;

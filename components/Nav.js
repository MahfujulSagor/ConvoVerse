import React from "react";
import { Button } from "./ui/button";
import logo from "@/public/OpenAI-black.svg";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="flex justify-between items-center px-4 h-2xl mb-[6rem] ">
      <div>
        <Image src={logo} height={80} width={80} alt="logo" className="" />
      </div>
      <div className="flex gap-4">
        <Button variant={"outline"} className={`h-10 w-30`}>Login</Button>
        <Button className={`h-10 w-30`}>Sign Up</Button>
      </div>
    </nav>
  );
};

export default Nav;

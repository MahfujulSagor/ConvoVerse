import React from "react";
import { Button } from "./ui/button";
import logo from "@/public/OpenAI-white.svg";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-4 h-2xl mb-[6rem] max-md:mb-[4rem] ">
      <div>
        <Image src={logo} height={50} width={50} alt="logo" className="" />
      </div>
      <div className="flex gap-4">
        <Button variant={"outline"} className={``}>Login</Button>
        <Button className={``}>Sign Up</Button>
      </div>
    </nav>
  );
};

export default Nav;

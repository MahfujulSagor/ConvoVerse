import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import mac from "@/public/macbook_mockup.webp";
import iphone from "@/public/iPhone_mockup.webp";
import demo from "@/public/demo_ai_2.webp";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center font-bold text-6xl max-md:text-5xl ">
          The only AI tool you need.
        </h1>
        <p className="text-center pb-10 font-semibold text-xl max-md:text-base ">
          Use top class AI models without the large pricetag.
        </p>
      </div>

      <div>
        <Button className=" mb-5">Get Started</Button>
      </div>

      <div className="relative w-full flex items-center justify-center ">
          <div className="relative ">
          <div className="relative h-[440px] max-md:h-[240px] w-[668px] max-md:w-[468px] rounded-3xl ">
            <Image
            src={mac}
            width={660}
            alt="macbook"
            className="relative z-3 "
            />
            <div className="absolute rounded-3xl z-2 top-8 max-md:top-6 right-17 max-md:right-10.5 h-[370px] max-md:h-[270px] w-[540px] max-md:w-[385px] overflow-hidden  ">
              <Image
              src={demo}
              alt="mac_demo"
              className=" top-0 right-0 h-full w-full "
              />
            </div>
          </div>
          </div>

          <div className="absolute top-[21%] right-[15%] max-lg:hidden ">
          <div className="relative h-[350px] w-[165px] rounded-[3rem] ">
            <Image
            src={iphone}
            alt="iphone"
            className="relative z-5 "
            />
            <div className="absolute z-4 top-2 right-1 h-[92%] w-[95%] rounded-[2rem] overflow-hidden  ">
              <Image
              src={demo}
              alt="iphone_demo"
              className=" top-0 right-0 h-full w-full "
              />
            </div>
          </div>
          </div>
      </div>
    </div>
  );
};

export default Landing;

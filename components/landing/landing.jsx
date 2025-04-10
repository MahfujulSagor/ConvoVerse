"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import mac from "@/public/macbook_mockup.webp";
import iphone from "@/public/iPhone_mockup.webp";
import demo from "@/public/demo_ai_2.webp";
import AnimateButton from "../animateButton";
import gsap from "gsap";

const Landing = () => {
  const desktopDivRef = useRef(null);
  const iphoneDivRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const desktopDiv = desktopDivRef.current;
    const iphoneDiv = iphoneDivRef.current;
    const heading = headingRef.current;
    const text = textRef.current;

    if (!desktopDiv || !iphoneDiv || !heading || !text) return;

    const ctx = gsap.context(() => {
      gsap.from(heading, {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: "power2.out",
      });

      gsap.from(text, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out",
      });

      gsap.fromTo(
        iphoneDiv,
        {
          opacity: 0,
          x: 200,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        desktopDiv,
        {
          opacity: 0,
          x: -200,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full px-4 flex flex-col gap-4">
        <h1
          ref={headingRef}
          className="text-center font-bold text-6xl max-sm:text-5xl"
        >
          The only AI tool you need.
        </h1>
        <p
          ref={textRef}
          className="text-center pb-10 font-semibold text-xl max-md:text-base"
        >
          Use top class AI models without the large pricetag.
        </p>
      </div>

      <div>
        <AnimateButton text="Get Started" routerPath="/auth/get-started" />
      </div>

      <div className="relative w-full flex items-center justify-center">
        <div className="relative max-[512px]:hidden">
          <div
            ref={desktopDivRef}
            className="relative h-[440px] max-md:h-[240px] w-[668px] max-md:w-[468px] rounded-3xl"
          >
            <Image
              src={mac}
              width={660}
              alt="macbook"
              className="relative z-3"
            />
            <div className="absolute rounded-3xl z-2 top-8 max-md:top-6 right-17 max-md:right-10 h-[370px] max-md:h-[270px] w-[540px] max-md:w-[385px] overflow-hidden">
              <Image
                src={demo}
                alt="mac_demo"
                lazy="true"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          ref={iphoneDivRef}
          className="absolute top-[21%] right-[15%] lg:flex hidden"
        >
          <div className="relative h-[350px] w-[165px] rounded-[3rem]">
            <Image src={iphone} alt="iphone" className="relative z-5" />
            <div className="absolute z-4 top-2 right-1 h-[92%] w-[95%] rounded-[2rem] overflow-hidden">
              <Image
                src={demo}
                alt="iphone_demo"
                lazy="true"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 max-[512px]:flex hidden">
          <div className="relative h-[350px] w-[165px] rounded-[3rem]">
            <Image src={iphone} alt="iphone" className="relative z-5" />
            <div className="absolute z-4 top-2 right-1 h-[92%] w-[95%] rounded-[2rem] overflow-hidden">
              <Image
                src={demo}
                alt="iphone_demo"
                lazy="true"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

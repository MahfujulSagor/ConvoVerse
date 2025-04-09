"use client";
import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleSignIn from "@/components/GoogleSignIn";
import gsap from "gsap";

const GetStarted = () => {
  const cardRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !buttonRef.current) {
      return;
    }

    const tl = gsap.timeline();

    tl.from(cardRef.current, {
      opacity: 0,
      y: -40,
      duration: 0.2,
      ease: "power2.out",
    });

    tl.from(buttonRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
      <Card ref={cardRef} className="w-[500px] mx-4">
        <CardHeader>
          <CardTitle className={"text-center font-bold text-3xl"}>
            Get Started
          </CardTitle>
          <CardDescription className={"text-center font-semibold "}>
            Explore LLM without big pricetag.
          </CardDescription>
        </CardHeader>
        <CardContent className={"flex flex-col gap-2"}>
          <div ref={buttonRef}>
            <GoogleSignIn />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetStarted;

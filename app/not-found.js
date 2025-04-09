"use client";
import CenterUnderline from "@/fancy/components/text/underline-center";
import NumberTicker from "@/fancy/components/text/basic-number-ticker";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="lg:text-[340px] md:text-[240px] text-9xl font-extrabold">
          <NumberTicker
            from={0}
            target={404}
            autoStart={true}
            transition={{ duration: 3.5, type: "tween", ease: "easeInOut" }}
          />
        </h1>
        <h2 className="lg:text-6xl text-4xl font-bold text-muted-foreground">
          Hmm...
        </h2>
        <p className="md:text-2xl text-xl text-ring">
          We&apos;re fairly sure this page used to be here, but seems to have
          gone missing. We do apologise on it&apos;s behalf.
        </p>
        <CenterUnderline
          onClick={() => router.back()}
          label="Let's head back"
          className="text-2xl"
        />
      </div>
    </div>
  );
};

export default NotFound;

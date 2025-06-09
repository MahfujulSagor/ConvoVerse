"use client";
import gsap from "gsap";
import React, { useLayoutEffect, useRef } from "react";

const Onboarding = () => {
  const onboardingRef = useRef(null);

  useLayoutEffect(() => {
    if (!onboardingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        onboardingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={onboardingRef}
      className="relative overflow-hidden cursor-default w-full rounded-xl bg-background max-w-[760px] mx-auto border p-8"
    >
      <p className="md:text-xl text-base font-bold">
        On-Demand Access to the Latest AI Models
      </p>
      <p className="md:text-base text-sm text-muted-foreground mt-2">
        Gain access to cutting-edge AI technology and models for a fraction of
        the cost of traditional subscriptions.You can tap into a wide range of
        AI tools, paying only for what you use—no subscriptions, no hidden fees,
        and no expiration dates.{" "}
      </p>
      <div className="flex flex-row max-w-2xl gap-4 mt-4">
        <div className="rounded-xl w-1/2 p-4 flex flex-col gap-2 leading-relaxed text-center max-w-xl border border-dashed bg-background">
          <p className="flex flex-row justify-center gap-4 items-center font-bold">
            💸 Cost-Effective AI Access
          </p>
          <p className="sm:text-sm text-xs text-muted-foreground">
            Start now and save big compared to traditional subscriptions. Pay
            only for what you use, no long-term commitments.
          </p>
        </div>

        <div className="rounded-xl w-1/2 p-4 flex flex-col gap-2 leading-relaxed text-center max-w-xl border border-dashed bg-background">
          <p className="flex flex-row justify-center gap-4 items-center font-bold">
            🌐 One Platform, Many Tools
          </p>
          <p className="sm:text-sm text-xs text-muted-foreground">
            Access multiple AI tools for text, images, and more—all in one
            flexible platform. No need for separate subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

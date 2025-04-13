"use client";
import Balance from "@/components/CreditBalance";
import Onboarding from "@/components/onboarding";
import { useAI } from "@/context/ai-context";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import React, { useLayoutEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

const Dashboard = () => {
  const { handleNewChat } = useAI();
  const [loading, setLoading] = useState(false);
  const arrowRef = useRef(null);
  const arrowDivRef = useRef(null);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    const btn = buttonRef.current;
    const arrow = arrowRef.current;
    const arrowDiv = arrowDivRef.current;

    if (!btn || !arrow || !arrowDiv) return;

    const handleEnter = () => {
      gsap.to(arrow, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(arrowDiv, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(arrow, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      });
      gsap.to(arrowDiv, {
        scale: 0.4,
        duration: 0.2,
        ease: "power2.inOut",
      });
    };

    const ctx = gsap.context(() => {
      gsap.set(arrow, { scale: 0, opacity: 0 });
      gsap.set(arrowDiv, { scale: 0.4 });

      gsap.fromTo(
        btn,
        { scale: 0 },
        { scale: 1, duration: 0.5, ease: "power2.out" }
      );

      btn.addEventListener("mouseenter", handleEnter);
      btn.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      ctx.revert();
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      await handleNewChat();
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Error creating chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full flex justify-end items-center p-4">
        <Balance />
      </div>
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Onboarding />
        <div className="w-full flex flex-col items-center justify-center">
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            className="mt-8 p-2 cursor-pointer bg-muted rounded-full flex md:justify-between justify-center items-center gap-2"
          >
            {loading ? (
              <div className="flex items-center justify-center w-full min-w-[150px] min-h-[44px]">
                <BeatLoader color="oklch(0.985 0 0)" />
              </div>
            ) : (
              <>
                <span className="md:ml-4 md:text-lg text-base font-medium">
                  Start chating
                </span>
                <div
                  ref={arrowDivRef}
                  className="bg-foreground p-3 text-background rounded-full md:flex hidden"
                >
                  <ArrowUpRight ref={arrowRef} />
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

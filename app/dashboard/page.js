"use client";
import Loader from "@/components/Loader";
import Onboarding from "@/components/onboarding";
import { useAI } from "@/context/ai-context";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

const Dashboard = () => {
  const { handleNewChat } = useAI();
  const [loading, setLoading] = useState(false);
  const arrowRef = useRef(null);
  const arrowDivRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const btn = buttonRef.current;
    const arrow = arrowRef.current;
    const arrowDiv = arrowDivRef.current;

    if (!btn || !arrow) return;

    gsap.set(arrow, { scale: 0, opacity: 0 });
    gsap.set(arrowDiv, { scale: 0.4 });

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

    btn.addEventListener("mouseenter", handleEnter);
    btn.addEventListener("mouseleave", handleLeave);

    return () => {
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Onboarding />
      <div className="w-full flex flex-col items-center justify-center">
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className="mt-8 p-2 cursor-pointer bg-muted rounded-full flex justify-between items-center gap-2"
        >
          {loading ? (
            <div className="flex items-center justify-center w-full min-w-[150px] min-h-[44px]">
              <BeatLoader color="oklch(0.985 0 0)" />
            </div>
          ) : (
            <>
              <span className="ml-4">Start chating</span>
              <div
                ref={arrowDivRef}
                className="bg-foreground p-3 text-background rounded-full"
              >
                <ArrowUpRight ref={arrowRef} />
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

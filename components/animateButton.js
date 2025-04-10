"use client";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect, useRef } from "react";

const AnimateButton = ({ textClass = "", text = "", routerPath = "" }) => {
  const router = useRouter();

  const buttonRef = useRef(null);
  const arrowRef = useRef(null);
  const arrowDivRef = useRef(null);

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
      gsap.to(btn, {
        backgroundPosition: "top left",
        backgroundColor: "var(--sidebar)",
        duration: 0.8,
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
      gsap.to(btn, {
        backgroundPosition: "bottom right",
        backgroundColor: "var(--muted)",
        duration: 0.8,
        ease: "power2.inOut",
      });
    };

    const ctx = gsap.context(() => {
      gsap.set(arrow, { scale: 0, opacity: 0 });
      gsap.set(arrowDiv, { scale: 0.4 });
      gsap.from(btn, {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "power2.out",
      });

      btn.addEventListener("mouseenter", handleEnter);
      btn.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      ctx.revert();
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, []);
  return (
    <button
      onClick={() => router.push(routerPath)}
      ref={buttonRef}
      className={`cursor-pointer rounded-full bg-muted p-2 min-w-[150px] flex md:justify-between justify-center items-center gap-2`}
    >
      <span className={`${textClass} md:ml-2`}>{text}</span>
      <div
        ref={arrowDivRef}
        className="bg-foreground rounded-full p-1 md:flex hidden"
      >
        <ArrowUpRight ref={arrowRef} color="#000000" />
      </div>
    </button>
  );
};

export default AnimateButton;

"use client";
import Loader from "@/components/Loader";
import { useAI } from "@/context/ai-context";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Chat = () => {
  const router = useRouter();

  useEffect(()=> {
    router.back();
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Loader />
    </>
  );
};

export default Chat;

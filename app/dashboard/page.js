"use client";
import { TextScramble } from "@/components/motion-primitives/text-scramble";
import { Button } from "@/components/ui/button";
import { useAI } from "@/context/ai-context";
import { useAppwrite } from "@/context/appwrite-context";
import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

const Dashboard = () => {
  const { handleNewChat } = useAI();
  const { session } = useAppwrite();
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    const userId = session?.$id;

    if (!userId) {
      console.error("No user found");
      return;
    }

    setLoading(true);
    try {
      await handleNewChat({ userId });
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Error creating chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="mx-auto">
        <TextScramble className="text-2xl" duration={1.2} characterSet=". ">
          This is the Dashboard
        </TextScramble>
        <div className="w-full flex flex-col items-center justify-center">
          <Button
            variant=""
            onClick={handleButtonClick}
            className="mt-8 cursor-pointer"
          >
            {loading ? <BeatLoader /> : "Start Your Journey"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

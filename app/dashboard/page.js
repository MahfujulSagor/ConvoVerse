"use client";
import { Button } from "@/components/ui/button";
import { useAI } from "@/context/ai-context";
import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

const Dashboard = () => {
  const { handleNewChat } = useAI();
  const [loading, setLoading] = useState(false);

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
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="mx-auto">
        <p className="text-2xl">This is the Dashboard</p>
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

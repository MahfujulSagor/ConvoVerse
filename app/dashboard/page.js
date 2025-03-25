"use client";
import ChatItem from "@/components/chat/ChatItem";
import { SendHorizonal } from "lucide-react";
import React from "react";

const Dashboard = () => {
  return (
    <div className="relative max-w-3xl w-full mx-auto my-16">
      <ChatItem/>
      {/* TODO: Fix layout issues */}
      <div className="w-full bg-background max-w-3xl fixed bottom-0 pb-8">
        <div className="w-full min-h-20 rounded-2xl p-4 flex items-center border">
          <div className="w-full flex justify-center items-center">
            <textarea
              rows={1}
              autoFocus
              className="border-none outline-none resize-none font-medium w-full text-white dark:bg-background"
              placeholder="Ask anything"
            />
          </div>
          <div className="">
            <button className='cursor-pointer flex justify-center items-center text-[#676767]' >
              <SendHorizonal className="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

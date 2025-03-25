"use client";
import ChatItem from "@/components/chat/ChatItem";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import React from "react";

const Dashboard = () => {
  return (
    <div className="max-w-3xl w-full mx-auto relative">
      <div className="mr-8">
        <ChatItem />
        <div className="w-full bg-background pb-8 sticky bottom-0 flex justify-center items-center">
          <div className="w-full min-h-20 max-w-3xl bg-background rounded-2xl p-4 border">
            <form>
              <div className="w-full flex justify-center items-center">
                <Textarea
                  rows={1}
                  autoFocus
                  className="max-h-72 ChatInput border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none font-medium w-full text-white dark:bg-background"
                  placeholder="Ask anything"
                />
              </div>
              <div className="w-full flex justify-end items-center mt-2">
                <button className="cursor-pointer flex justify-center items-center text-[#676767]">
                  <SendHorizonal className="" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

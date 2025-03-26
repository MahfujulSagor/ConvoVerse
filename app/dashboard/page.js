"use client";
import ChatItem from "@/components/chat/ChatItem";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import React from "react";
import textSnippet from "@/lib/static-response";
import { userTextSnippet } from "@/lib/static-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inputSchema = z.object({
  message: z.string().nonempty("Message cannot be empty"),
});

const Dashboard = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(inputSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };
  return (
    <div className="w-full">
      {/* Navbar */}
      <div className="sticky top-0 z-2 flex justify-between items-center bg-background w-full">
        {/* Model selector */}
        <div className="flex justify-between items-center py-4 px-2">
          <Select className="">
            <SelectTrigger className="w-[140px] md:w-[180px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="o1">o1</SelectItem>
                <SelectItem value="o1-mini">o1-mini</SelectItem>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Balance */}
        <div className="border rounded-4xl mr-8">
          <div className="flex justify-between items-center py-2 px-4 md:py-3 md:px-6">
            <div className="text-sm font-medium">Balance:</div>
            <div className="text-sm font-medium">$0.00</div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl w-full mx-auto relative mt-26 min-h-screen">
        <div className="mr-8">
          <div className="min-h-screen mb-26">
            <ChatItem
              content={userTextSnippet.message}
              role={userTextSnippet.role}
            />
            <ChatItem content={textSnippet.message} role={textSnippet.role} />
            <ChatItem
              content={userTextSnippet.message}
              role={userTextSnippet.role}
            />
            <ChatItem content={textSnippet.message} role={textSnippet.role} />
            <ChatItem
              content={userTextSnippet.message}
              role={userTextSnippet.role}
            />
            <ChatItem content={textSnippet.message} role={textSnippet.role} />
            <ChatItem
              content={userTextSnippet.message}
              role={userTextSnippet.role}
            />
            <ChatItem content={textSnippet.message} role={textSnippet.role} />
          </div>
          <div className="w-full bg-background pb-8 sticky bottom-0 flex justify-center items-center">
            <div className="w-full min-h-20 max-w-3xl bg-background rounded-2xl p-4 border">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full flex justify-center items-center">
                  <Textarea
                    autoFocus
                    {...register("message")}
                    className="max-h-72 ChatInput border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none font-medium w-full text-white dark:bg-background"
                    placeholder="Ask anything"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </div>
                <div className="w-full flex justify-end items-center mt-2">
                  <Button
                    type="submit"
                    variant="ghost"
                    className="cursor-pointer flex justify-center items-center text-[#676767]"
                  >
                    <SendHorizonal className="size-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

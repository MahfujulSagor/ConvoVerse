"use client";
import ChatItem from "@/components/chat/ChatItem";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, SendHorizonal } from "lucide-react";
import React, { useState } from "react";
import textSnippet ,{ userTextSnippet } from "@/lib/static-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { BeatLoader } from "react-spinners";
import { Input } from "@/components/ui/input";

const inputSchema = z.object({
  message: z.string().nonempty("Message cannot be empty"),
  model: z.string(),
  role: z.string(),
});

// ! This should be fetched from the server
const models = [
  {
    id: "o1",
    name: "o1",
  },
  {
    id: "o1-mini",
    name: "o1-mini",
  },
  {
    id: "gpt-4o",
    name: "gpt-4o",
  },
  {
    id: "gpt-4o-mini",
    name: "gpt-4o-mini",
  },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState(""); // ? User message

  const { register, handleSubmit, reset, control, setValue } = useForm({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      message: "",
      model: "gpt-4o-mini",
      // ? Will be handled in the server
      role: "user",
    },
  });

  // TODO: Send user message to the server
  const onSubmit = (data) => {
    setUserMessage(data.message);
    setValue("role", "user");
    console.log(data);
    reset();
  };

  // TODO: Check user balance
  const handleBalanceClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {/* Navbar */}
      <div className="sticky top-0 z-2 flex justify-between items-center bg-background w-full">
        {/* Model selector */}
        <div className="flex justify-between items-center py-4 px-2">
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                className=""
              >
                <SelectTrigger className="w-[140px] md:w-[180px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {models.length > 0 ? (
                      models.map((model) => (
                        <SelectItem key={model.id} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="Loading">
                        Loading...
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* Balance */}
        <Button
          variant='ghost'
          onClick={handleBalanceClick}
          className="border border-dashed rounded-4xl mr-8 cursor-pointer"
        >
          {loading ? (
            <div className="flex justify-center items-center px-4">
              <BeatLoader color="oklch(0.985 0 0)" />
            </div>
          ) : (
            <div className="flex justify-between items-center gap-1">
              <div className="text-sm font-medium">Balance:</div>
              <div className="text-sm font-medium text-teal-400">$10.00</div>
            </div>
          )}
        </Button>
      </div>
      <div className="max-w-3xl w-full mx-auto relative mt-26 min-h-screen">
        <div className="mr-8">
          {/* Chats */}
          <div className="min-h-screen max-w-[700px] mx-auto mb-26">
            <ChatItem
              content={userTextSnippet.message}
              role={userTextSnippet.role}
            />
            <ChatItem content={textSnippet.message} role={textSnippet.role} />
            <ChatItem content={userMessage} role={userTextSnippet.role} />
          </div>
          {/* Input */}
          <div className="w-full max-w-3xl bg-background pb-8 sticky bottom-0 flex justify-center items-center">
            <div className="w-full min-h-20 rounded-2xl p-4 border">
              <div>
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
                <div className="w-full flex justify-between items-center mt-2">
                  <div>
                    {/* FIXME: This should be a file input  */}
                    <Button
                      variant="ghost"
                      className="cursor-pointer flex justify-center items-center text-[#676767]"
                    >
                      <Paperclip className="size-5" />
                    </Button>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="cursor-pointer flex justify-center items-center text-[#676767]"
                    >
                      <SendHorizonal className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Dashboard;

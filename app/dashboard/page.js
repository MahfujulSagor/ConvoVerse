"use client";
import ChatItem from "@/components/chat/ChatItem";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, SendHorizonal } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { useAI } from "@/context/ai-context";
import { toast } from "sonner";

const inputSchema = z.object({
  ai: z.string(),
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
  const { currentAI } = useAI();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // * Chat messages

  const { register, handleSubmit, reset, control, setValue } = useForm({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      ai: currentAI.name,
      message: "",
      model: "gpt-4o-mini",
      // ? Will be handled in the server
      role: "user",
    },
  });

  // * Sync AI model with the form
  useEffect(() => {
    setValue("ai", currentAI.name);
  }, [currentAI, setValue]);

  const deepseek = async (prompt) => {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // model: "deepseek/deepseek-r1-distill-llama-70b:free",
            model: "deepseek/deepseek-chat-v3-0324:free", // ! Better
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );
      const data = response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // TODO: Send user message to the server
  const onSubmit = async (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: data.message,
        role: data.role,
      },
    ]);
    try {
      const res = await deepseek(data.message);
      const aiMessage = res.choices[0].message.content;
      const aiRole = res.choices[0].message.role;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: aiMessage,
          role: aiRole,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
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
          variant="ghost"
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
          <div className="min-h-screen code-blocks max-w-[700px] mx-auto mb-26">
            {messages.map((msg, index) => (
              <ChatItem key={index} content={msg.content} role={msg.role} />
            ))}
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
                    {/* <Button
                      variant="ghost"
                      className="cursor-pointer flex justify-center items-center text-[#676767]"
                    >
                      <Paperclip className="size-5" />
                    </Button> */}
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

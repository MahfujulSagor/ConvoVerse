"use client";
import ChatItem from "@/components/chat/ChatItem";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, Paperclip, SendHorizonal, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const inputSchema = z.object({
  message: z.string().nonempty("Message cannot be empty"),
  model_id: z.string(),
  files: z.array(z.instanceof(File)).optional(),
  role: z.string(),
});

const Dashboard = () => {
  const { currentAI } = useAI();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // * Chat messages
  const [models, setModels] = useState([]); // * Models
  const [selectedFiles, setSelectedFiles] = useState([]); // * Selected files

  const responseRef = useRef();

  const { register, handleSubmit, resetField, control, setValue, getValues } =
    useForm({
      resolver: zodResolver(inputSchema),
      defaultValues: {
        message: "",
        model_id: "",
        files: [],
        role: "user",
      },
    });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          `/api/ai/models/${currentAI.organization}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();

        setModels(data);

        setValue("model_id", data[0]?.$id || "");

        toast.info(`${data[0]?.display_name} selected`);

        localStorage.setItem("models", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    const initializeModels = () => {
      try {
        const storedModels = localStorage.getItem("models");

        const parsedModels = storedModels ? JSON.parse(storedModels) : [];

        if (
          parsedModels &&
          parsedModels.length > 0 &&
          parsedModels[0]?.name === currentAI.organization
        ) {
          setModels(parsedModels);

          setValue("model_id", parsedModels[0]?.$id || "");
        } else {
          fetchModels();
        }
      } catch (error) {
        console.error("Error initializing models:", error);
      }
    };

    // * Initialize models
    initializeModels();
  }, [currentAI, setValue]);

  const aiChat = async ({ message, model_id }) => {
    responseRef.current = "";
    try {
      const response = await fetch(`/api/chat/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message,
          model_id: model_id,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }
      const decoder = new TextDecoder();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // Append new chunk to buffer
          buffer += decoder.decode(value, { stream: true });
          // Process complete lines from buffer
          while (true) {
            const lineEnd = buffer.indexOf("\n");
            if (lineEnd === -1) break;
            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                console.log("Streaming complete.");
                return;
              }
              try {
                const parsed = JSON.parse(data);

                if (parsed?.error?.code === 429) {
                  console.error("Quota exceeded. Please try again later.");
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      role: "assistant",
                      content:
                        "The system is currently unavailable due to high demand. Please try again later.",
                    },
                  ]);
                  return;
                }

                if (
                  !parsed?.choices ||
                  !Array.isArray(parsed.choices) ||
                  parsed.choices.length === 0
                ) {
                  console.error("Invalid AI response format:", parsed);
                  continue;
                }

                const content = parsed.choices[0]?.delta.content || "";

                if (!content) {
                  console.warn("No content found in response");
                  continue;
                }

                responseRef.current += content;
                setMessages((prevMessages) => {
                  const lastMessage = prevMessages[prevMessages.length - 1];
                  if (lastMessage?.role === "assistant") {
                    return [
                      ...prevMessages.slice(0, -1),
                      { ...lastMessage, content: responseRef.current },
                    ];
                  } else {
                    return [...prevMessages, { role: "assistant", content }];
                  }
                });
              } catch (e) {
                console.error("Streaming failed", e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error while reading response:", error);
      } finally {
        reader.cancel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = async (e) => {
    try {
      const files = Array.from(e.target.files);

      if (!files.length) {
        toast.warning("No files selected");
        return;
      }

      //* Create blob URLs for each file
      const urls = files.map((file) => URL.createObjectURL(file));

      //* Store original files for uploading
      const existingFiles = Array.isArray(getValues("files"))
        ? getValues("files")
        : [];
      const newFiles = [...existingFiles, ...urls];

      //* Check if image limit is reached
      if (newFiles.length > 3) {
        toast.warning("You can upload a maximum of 3 files.");
        return;
      }

      setValue("files", newFiles);
      setSelectedFiles(newFiles);

      toast.success(`${files.length} file(s) selected`);
    } catch (error) {
      console.error("Error selecting files:", error);
      toast.error("Error selecting files");
      return;
    }
  };

  const handleFileRemove = (index) => {
    try {
      const files = getValues("files");
      const updatedFiles = files.filter((_, i) => i !== index);
      setValue("files", updatedFiles);
      setSelectedFiles(updatedFiles);

      toast.warning(`File removed`);
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Error removing file");
      return;
    }
  };

  const onSubmit = async (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: data.message,
        role: data.role,
      },
    ]);

    const selectedModel = models.find((model) => model.$id === data.model_id);
    if (!selectedModel) return console.error("Invalid model selected");
    const model_id = selectedModel?.$id || "";

    try {
      resetField("message");
      await aiChat({ ...data, model_id: model_id });
    } catch (error) {
      console.log(error);
      resetField("message");
    }
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
            name="model_id"
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
                      models.map((model, index) => (
                        <SelectItem key={index} value={model.$id}>
                          {model.display_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        disabled
                        value="Loading"
                        className="flex justify-center items-center"
                      >
                        <BeatLoader color="oklch(0.985 0 0)" />
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
      <div className="max-w-3xl w-full mx-auto relative min-h-screen">
        <div className="mr-8">
          {/* Chats */}
          <div className="overflow-y-auto">
            <div className="min-h-[80vh] code-blocks max-w-[700px] mx-auto mb-20">
              {messages.map((message, index) => (
                <ChatItem
                  key={index}
                  content={message.content}
                  role={message.role}
                />
              ))}
            </div>
          </div>
          {/* Input */}
          <div className="w-full max-w-3xl bg-background pb-8 sticky bottom-0 flex justify-center items-center">
            <div className="w-full min-h-20 rounded-2xl p-4 border border-dashed">
              {/* Image Preview */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {selectedFiles &&
                    selectedFiles.length > 0 &&
                    selectedFiles.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          height={100}
                          width={100}
                          alt={`Preview ${index}`}
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          // onClick={() => {
                          //   setValue(
                          //     "files",
                          //     getValues("files").filter((_, i) => i !== index)
                          //   );
                          // }}
                          onClick={() => handleFileRemove(index)}
                          className="absolute top-1 right-1 cursor-pointer p-1 rounded-2xl bg-secondary hover:bg-secondary/50 ease-in-out duration-100"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              {/* Prompt Input */}
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
                  {/* File Input */}
                  <div>
                    <Controller
                      name="files"
                      control={control}
                      render={({
                        field: { value = [], onChange, ...rest },
                      }) => (
                        <>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            id="files"
                            className="hidden"
                            onChange={(e) => handleFileChange(e)}
                            disabled={value.length >= 3}
                          />
                          <Button
                            asChild
                            variant="ghost"
                            className={`cursor-pointer flex justify-center items-center text-[#676767] ${
                              value.length >= 3 &&
                              "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={value.length >= 3}
                          >
                            <Label htmlFor="files">
                              <Paperclip className="size-5" />
                            </Label>
                          </Button>
                        </>
                      )}
                    />
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

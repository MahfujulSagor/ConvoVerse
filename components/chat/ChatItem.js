"use client";
import React, { useState } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { detectLanguage } from "@/lib/detectLanguage";

const extractCode = (message) => {
  if (message && message.includes("```")) {
    const codes = message.split("```");
    return codes;
  }
  return null;
};

const isCode = (str) => {
  if (
    str.includes(
      "=" ||
        str.includes("=") ||
        str.includes(";") ||
        str.includes("]") ||
        str.includes("[") ||
        str.includes("{") ||
        str.includes("}") ||
        str.includes("#") ||
        str.includes("//")
    )
  ) {
    return true;
  }
  return false;
};

const ChatItem = ({ content, role }) => {
  const [copied, setCopied] = useState(false);
  const language = detectLanguage(content);
  const messageBlock = extractCode(content);

  const handleCopy = async () => {
    try {
      // await navigator.clipboard.writeText();
      setCopied(true);
      toast.success("Code snippet copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy code snippet");
    }
  };

  return role === "assistant" ? (
    <div className="mb-6 md:text-base text-sm">
      {!messageBlock && (
        <div className="my-2">
          <Markdown>{content}</Markdown>
        </div>
      )}
      {messageBlock &&
        messageBlock.map((block, index) => {
          return isCode(block) ? (
            <div key={index} className="relative mt-2">
              <Button
                variant="ghost"
                onClick={handleCopy}
                className="absolute top-1 right-1 cursor-pointer text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <SyntaxHighlighter
                className="rounded-lg code-block max-w-3xl overflow-x-scroll"
                key={index}
                language={language}
                style={nightOwl}
              >
                {block}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div key={index} className="mt-2">
              <Markdown>{block}</Markdown>
            </div>
          );
        })}
    </div>
  ) : (
    <div className="mb-6 w-full flex justify-end items-center md:text-base text-sm">
      <div className="max-w-lg bg-secondary rounded-4xl py-2 px-5">
        <div className="my-2">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;

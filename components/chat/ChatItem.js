"use client";
import textSnippet from "@/lib/static-response";
import Image from "next/image";
import React, { useState } from "react";
import OpenAiBlack from "@/public/OpenAI-black.svg";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const extractCode = (message) => {
  if (message.includes("```")) {
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

const ChatItem = ({ content = textSnippet, role = "assistant" }) => {
  const [copied, setCopied] = useState(false);
  const messageBlock = extractCode(content);

  const handleCopy = async () => {
    try {
      // await navigator.clipboard.writeText();
      setCopied(true);
      toast.success("Code snippet copied to clipboard");
      setTimeout(()=> setCopied(false), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy code snippet");
    }
  };

  return role === "assistant" ? (
    <div>
      <div>
        <Image src={OpenAiBlack} alt="OpenAi logo" width={50} height={50} />
      </div>
      {!messageBlock && (
        <div>
          <Markdown>{content}</Markdown>
        </div>
      )}
      {messageBlock &&
        messageBlock.map((block, index) => {
          return isCode(block) ? (
            <div key={index} className="relative">
              <Button variant='ghost' onClick={handleCopy} className='absolute top-1 right-1 cursor-pointer text-white'><Copy className="w-4 h-4"/></Button>
              <SyntaxHighlighter
                className='rounded-lg code-block max-w-3xl overflow-x-scroll'
                key={index}
                language="javascript"
                style={nightOwl}
              >
                {block}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div key={index}>
              <Markdown>{block}</Markdown>
            </div>
          );
        })}
    </div>
  ) : (
    <div>User</div>
  );
};

export default ChatItem;

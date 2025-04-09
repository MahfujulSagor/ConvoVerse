"use client";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Button } from "../ui/button";
import { Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { detectLanguage } from "@/lib/detectLanguage";
import gsap from "gsap";

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
  const [copied, setCopied] = useState({});
  const language = detectLanguage(content);
  const messageBlock = extractCode(content);

  const userMessageRef = useRef(null);

  useEffect(() => {
    if (role === "user" && userMessageRef.current) {
      gsap.fromTo(
        userMessageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [content, role]);

  const handleCodeCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied((prev) => ({ ...prev, [index]: true }));
      toast.success("Code snippet copied to clipboard");
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [index]: false }));
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy code snippet");
    }
  };

  return role === "assistant" ? (
    <div className="mb-6 md:text-base text-sm">
      {!messageBlock && (
        <div className="my-2">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto">
                  <table
                    className="table-auto border-collapse border w-full my-8"
                    {...props}
                  />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border bg-slate-800 px-3 py-2 text-left font-bold"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td className="border px-3 py-2" {...props} />
              ),
            }}
          >
            {content}
          </Markdown>
        </div>
      )}
      {messageBlock &&
        messageBlock.map((block, index) => {
          return isCode(block) ? (
            <div key={index} className="relative mt-2">
              <Button
                variant="ghost"
                onClick={() => handleCodeCopy(block, index)}
                className="absolute top-1 right-1 cursor-pointer text-white"
              >
                {copied[index] ? (
                  <CheckCheck className="w-4 h-4 text-teal-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <SyntaxHighlighter
                className="rounded-lg code-block max-w-3xl overflow-x-scroll border border-dashed"
                key={index}
                language={language}
                style={nightOwl}
              >
                {block}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div key={index} className="mt-2">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto">
                      <table
                        className="table-auto border-collapse border w-full my-8"
                        {...props}
                      />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="border bg-slate-800 px-3 py-2 text-left font-bold"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border px-3 py-2" {...props} />
                  ),
                }}
              >
                {block}
              </Markdown>
            </div>
          );
        })}
    </div>
  ) : (
    <div className="my-6 w-full flex justify-end items-center md:text-base text-sm">
      <div ref={userMessageRef} className="max-w-3xl bg-secondary rounded-4xl px-5">
        <div className="my-2">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;

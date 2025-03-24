import textSnippet from "@/lib/static-response";
import Image from "next/image";
import React from "react";
import OpenAiBlack from "@/public/OpenAI-black.svg";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

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
  const messageBlock = extractCode(content);

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
              <Button variant='outline' className='absolute top-1 right-1 cursor-pointer'><Copy/></Button>
              <SyntaxHighlighter
                className='rounded-lg'
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

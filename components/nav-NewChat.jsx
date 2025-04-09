"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Pencil } from "lucide-react";
import Link from "next/link";
import ToolTip from "./ToolTip";
import { useAI } from "@/context/ai-context";

const items = [
  {
    title: "New Chat",
    url: "#",
  },
];

export function NavNewChat() {
  const { handleNewChat } = useAI();

  const handleNewChatClick = async () => {
    try {
      await handleNewChat();
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Error creating new chat");
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chat_ai</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          return (
            <ToolTip key={index} text={"New Chat"} position={"right"}>
              <SidebarMenuItem>
                <Link href={item.url} onClick={handleNewChatClick}>
                  <SidebarMenuButton tooltip={item.title}>
                    <Pencil />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </ToolTip>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

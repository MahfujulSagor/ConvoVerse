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
import { usePathname } from "next/navigation";
import ToolTip from "./ToolTip";

const items = [
  {
    title: "New Chat",
    url: "#",
  },
];

export function NavNewChat() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>New Chat</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          return (
            <ToolTip key={index} text={"New Chat"} position={"right"}>
              <SidebarMenuItem>
                <Link href={item.url}>
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

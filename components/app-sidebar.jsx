"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AISwitcher } from "@/components/ai-switcher";
import { useAppwrite } from "@/context/appwrite-context";
import { NavNewChat } from "./nav-NewChat";
import { useAI } from "@/context/ai-context";

export function AppSidebar({ ...props }) {
  const { session } = useAppwrite();
  const { history } = useAI();

  const data = {
    user: {
      name: session?.name,
      email: session?.email,
      avatar: session?.avatar,
    },
    navMain: history.map((item) => ({
      title: item.title,
      url: `/dashboard/chat/${item.$id}`,
      id: item.$id,
    })),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AISwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavNewChat />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

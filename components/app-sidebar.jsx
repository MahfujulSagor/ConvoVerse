"use client";

import * as React from "react";
import { Truck, Store, Settings2, LayoutDashboard, Database, Tag, UserRound } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import OpenAI from "@/public/OpenAI-white.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AISwitcher } from "@/components/ai-switcher";

export function AppSidebar({ ...props }) {

  const data = {
    user: {
      name: "User",
      email: "user@gmail.com",
      avatar: UserRound,
    },
    AI: [
      {
        name: "OpenAI",
        logo: OpenAI,
      },
      {
        name: "Deepseek",
        logo: Store,
      },
      // {
      //   name: "Deepseek",
      //   logo: Store,
      // },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        url: "#",
        icon: Database,
      },
      {
        title: "Categories",
        url: "#",
        icon: Tag,
      },
      {
        title: "Orders",
        url: "#",
        icon: Truck,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AISwitcher AI={data.AI} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

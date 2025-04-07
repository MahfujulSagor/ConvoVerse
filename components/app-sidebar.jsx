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

export function AppSidebar({ ...props }) {
  const { session } = useAppwrite();

  const data = {
    user: {
      name: session?.name,
      email: session?.email,
      avatar: session?.avatar,
    },
    navMain: [
      {
        title: "Form in next.js",
        url: "#",
      },
      {
        title: "For loop in python",
        url: "#",
      },
      {
        title: "If statement in javascript",
        url: "#",
      },
      {
        title: "For loop in javascript",
        url: "#",
      },
      {
        title: "If statement in python",
        url: "#",
      },
      {
        title: "Form in next.js",
        url: "#",
      },
      {
        title: "For loop in python",
        url: "#",
      },
      {
        title: "If statement in javascript",
        url: "#",
      },
      {
        title: "For loop in javascript",
        url: "#",
      },
      {
        title: "If statement in python",
        url: "#",
      },
      {
        title: "Form in next.js",
        url: "#",
      },
      {
        title: "For loop in python",
        url: "#",
      },
      {
        title: "If statement in javascript",
        url: "#",
      },
      {
        title: "For loop in javascript",
        url: "#",
      },
      {
        title: "If statement in python",
        url: "#",
      },
      {
        title: "Form in next.js",
        url: "#",
      },
      {
        title: "For loop in python",
        url: "#",
      },
      {
        title: "If statement in javascript",
        url: "#",
      },
    ],
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

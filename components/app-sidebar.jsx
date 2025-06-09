"use client";

import React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AISwitcher } from "@/components/ai-switcher";
import { NavNewChat } from "./nav-NewChat";
import { NavApiKey } from "./nav-api-key";

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AISwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavApiKey />
        <NavNewChat />
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

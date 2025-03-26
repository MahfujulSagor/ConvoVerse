"use client";

import React, { useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function AISwitcher({ AI }) {
  const { isMobile } = useSidebar();
  const [activeAI, setActiveAI] = useState(AI[0]);

  if (!activeAI) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <Image
                  src={activeAI.logo}
                  alt={activeAI.name}
                  width={32}
                  height={32}
                  className="shrink-0"
                />
              </div>
              <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate font-semibold">{activeAI.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              AI
            </DropdownMenuLabel>
            {AI.map((ai) => (
              <DropdownMenuItem
                key={ai.name}
                onClick={() => setActiveAI(ai)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm">
                  <Image
                    src={ai.logo}
                    alt={ai.name}
                    width={16}
                    height={16}
                    className="shrink-0"
                  />
                </div>
                {ai.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import React, { useEffect, useState } from "react";
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
import { useAI } from "@/context/ai-context";

export function AISwitcher() {
  const { isMobile } = useSidebar();
  const { currentAI, setCurrentAI, AI } = useAI();
  const [isClient, setIsClient] = useState(false);

  //! This part can be improved with suspanse and lazy loading
  // Ensure hydration only happens on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avoid hydration errors
  if (!isClient || !currentAI || !AI) {
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
                  src={currentAI.logo}
                  alt={currentAI.name}
                  width={32}
                  height={32}
                  className="shrink-0"
                />
              </div>
              <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate font-semibold">{currentAI.name}</span>
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
                onClick={() => {
                  setCurrentAI(ai);
                }}
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

"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BeatLoader } from "react-spinners";

export function NavMain({ items }) {
  const pathname = usePathname();

  if (!items || items.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Loading History" className={'flex items-center justify-center'}>
              <BeatLoader color="#cdcdcd" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={index}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                  <History color="#cdcdcd" />
                  <span className="text-[#cdcdcd]">{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

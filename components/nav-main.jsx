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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useAI } from "@/context/ai-context";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import HistorySkeleton from "./historySkeleton";

export function NavMain() {
  const pathname = usePathname();
  const { handleChatHistoryDelete, history } = useAI();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !history) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>History</SidebarGroupLabel>
        <SidebarMenu>
          <HistorySkeleton />
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  const items = history.map((item) => ({
    title: item.title,
    url: `/dashboard/chat/${item.$id}`,
    id: item.$id,
  }));

  if (items.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>History</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="text-[#cdcdcd] text-sm text-center">No history found</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  const handleHistoryDelete = async (historyId) => {
    if (!historyId) {
      toast.error("Failed to delete history");
      return;
    }

    let toastId;
    try {
      toastId = toast.loading(`Deleting history...`);
      await handleChatHistoryDelete(historyId);
    } catch (error) {
      console.error("Error deleting history:", error);
      toast.dismiss(toastId);
      toast.error("Error deleting history");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>History</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={index} className={"group/collapsible"}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={"cursor-pointer"}
              >
                <History color="#cdcdcd" />
                <Link href={item.url} className="text-nowrap truncate">
                  <span className="text-[#cdcdcd]">{item.title}</span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <div className="relative ml-auto p-1 rounded">
                      <Ellipsis
                        color="#cdcdcd"
                        size={20}
                        className="group-data-[collapsible=icon]:hidden"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className={"z-50"}>
                    <DropdownMenuItem
                      variant="destructive"
                      className={"text-rose-400 cursor-pointer"}
                      onClick={() => {
                        handleHistoryDelete(item.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

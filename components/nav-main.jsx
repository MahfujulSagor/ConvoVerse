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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useAI } from "@/context/ai-context";
import { toast } from "sonner";

export function NavMain({ items }) {
  const pathname = usePathname();
  const { handleChatHistoryDelete } = useAI();

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
      toast.success("History deleted");
    }
  };

  if (!items || items.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>History</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Loading History"
              className="flex items-center justify-center"
            >
              <BeatLoader size={10} color="#cdcdcd" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

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

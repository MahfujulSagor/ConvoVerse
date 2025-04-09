import React from "react";
import {
  SidebarMenuItem,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

const HistorySkeleton = () => {
  return Array.from({ length: 2 }).map((_, index) => (
    <SidebarMenuItem key={index} className={"mb-1"}>
      <div>
        <Skeleton className="w-full h-6" />
      </div>
    </SidebarMenuItem>
  ));
};

export default HistorySkeleton;

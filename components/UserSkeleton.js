import React from "react";
import { Skeleton } from "./ui/skeleton";

const UserSkeleton = () => {
  return (
    <div className="flex h-10 w-full items-center gap-2 rounded-lg p-2 text-sm leading-tight">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="grid flex-1 gap-1 text-left">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="ml-auto h-4 w-4 rounded" />
    </div>
  );
};

export default UserSkeleton;

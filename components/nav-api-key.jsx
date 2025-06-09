"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import ToolTip from "./ToolTip";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAppwrite } from "@/context/appwrite-context";
import { BeatLoader } from "react-spinners";

const items = [
  {
    title: "API Key",
    url: "#",
  },
];

const inputSchema = z.object({
  key: z.string().nonempty("Input can't be empty"),
});

export function NavApiKey() {
  const { session } = useAppwrite();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      key: "",
    },
  });

  const validateApiKey = async (key) => {
    const res = await fetch("/api/api-key/validate-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    return await res.json();
  };

  const onSubmit = async (data) => {
    try {
      resetField("key");

      const result = await validateApiKey(data.key);

      if (!result.valid) {
        console.warn("Invalid API key");
        toast.warning("Invalid API key");
        return;
      }

      const userId = session?.$id || "";

      const response = await fetch("/api/api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: data.key,
          userId: userId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save api key");
        toast.error("Failed to save api key");
        return;
      }

      toast.success("API key saved successfully");
    } catch (error) {
      console.error("Error while processing api key:", error);
      toast.error("Error while processing api key");
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>API Key</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          return (
            <ToolTip key={index} text={"API Key"} position={"right"}>
              <SidebarMenuItem className={"group"}>
                <Sheet>
                  <SheetTrigger asChild>
                    <Link href={item.url}>
                      <SidebarMenuButton
                        className={`cursor-pointer ${session?.has_api_key ? "" : "text-teal-200"}`}
                        tooltip={item.title}
                      >
                        <KeyRound className="text-teal-400" />
                        <span
                          className={`${session?.has_api_key ? "" : "animate-pulse"} group-hover:animate-none`}
                        >
                          {session?.has_api_key ? "Edit" : "Add"} API Key
                        </span>
                      </SidebarMenuButton>
                    </Link>
                  </SheetTrigger>
                  <SheetContent>
                    {/* Form */}
                    <SheetHeader>
                      <SheetTitle>API key</SheetTitle>
                      <SheetDescription>
                        Enter your OpenRouter API key here. Click save when
                        you&apos;re done.
                      </SheetDescription>
                      <SheetDescription>
                        If you don&apos;t have an API key, you can get one by
                        following the{" "}
                        <Link
                          href="/api-key/guides"
                          className="font-semibold text-blue-400"
                        >
                          Guides
                        </Link>
                        .
                      </SheetDescription>
                    </SheetHeader>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col gap-6"
                    >
                      {/* Input */}
                      <div className="px-4 grid gap-2">
                        <Label htmlFor="key">API Key</Label>
                        <div className="">
                          <Input
                            id="key"
                            type="text"
                            placeholder="Enter your API key"
                            {...register("key")}
                          />
                          {errors?.key && (
                            <p className="text-rose-500 text-sm">
                              {errors.key.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <SheetFooter>
                        <Button type="submit" className={"cursor-pointer"}>
                          {isLoading ? (
                            <BeatLoader color="oklch(0.985 0 0)" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className={"cursor-pointer"}
                          >
                            Close
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </form>
                  </SheetContent>
                </Sheet>
              </SidebarMenuItem>
            </ToolTip>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

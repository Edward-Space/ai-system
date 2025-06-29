"use client";

import { Bot, Brain } from "lucide-react";
import Link from "next/link";
import { SidebarMenuItem, SidebarMenu } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const MENU_ITEMS = [
  {
    label: "Quản Lý Bot",
    href: "/management-bot",
    icon: <Bot className="group-data-[collapsible=icon]:size-6 size-5" />,
  },
  {
    label: "Quản lý Knowledge",
    href: "/management-knowledge",
    icon: <Brain className="group-data-[collapsible=icon]:size-6 size-5"/>,
  },
];

export const SidebarMenuFeatures = ({ lang }: { lang: string }) => {
  const pathName = usePathname();
  //
  return (
    <SidebarMenu className="flex flex-col gap-1">
      {MENU_ITEMS.map((e, idx) => (
        <SidebarMenuItem key={idx}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/${lang}/${e.href}`}
                key={idx}
                className={cn(
                  "flex gap-2 items-center p-2 text-sm hover:bg-primary/20 transition-all duration-200 rounded-lg min-w-fit",
                  pathName == `/${lang}${e.href}` && "bg-primary/20"
                )}
              >
                {e.icon}
                <span className="group-data-[collapsible=icon]:hidden ">
                  {e.label}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{e.label}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

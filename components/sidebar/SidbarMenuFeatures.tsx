"use client";

import { Bot, Brain } from "lucide-react";
import Link from "next/link";
import { SidebarMenuItem, SidebarMenu, useSidebar } from "../ui/sidebar";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useEffect } from "react";

const MENU_ITEMS = [
  {
    label: "Quản Lý Bot",
    href: "/management-bot",
    icon: <Bot className="size-6" />,
  },
  {
    label: "Quản lý Knowledge",
    href: "/management-knowledge",
    icon: <Brain className="size-6" />,
  },
];

export const SidebarMenuFeatures = ({ lang }: { lang: string }) => {
  const pathName = usePathname();
  const params = useParams();
  /* ------------------------------------------------------------------------------------ */
  const { setOpen } = useSidebar();
  /* ------------------------------------------------------------------------------------ */
  const pathHideSidebar = [
    `/vi/management-bot/${params.id}`,
    `/vi/management-knowledge/${params.id}`,
    `/vi/management-knowledge/create/${params.knowledge_id}`,
  ];
  /* ------------------------------------------------------------------------------------ */
  useEffect(() => {
    if (pathHideSidebar.includes(pathName)) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [pathName]);
  /* ------------------------------------------------------------------------------------ */
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
                  "flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-primary/20 cursor-pointer min-w-fit",
                  pathName == `/${lang}${e.href}` && "bg-primary/20"
                )}
              >
                {e.icon}
                <span className="group-data-[collapsible=icon]:hidden truncate ">
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

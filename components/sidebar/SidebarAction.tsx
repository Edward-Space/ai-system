"use client";

import { useState } from "react";
import { Search, SquarePen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SearchChatCommand } from "./SearchChatCommand";
import Link from "next/link";

const SIDE_BAR_ACTION = [
  {
    id: "new-chat",
    label: "New Chat",
    icon: <SquarePen className="size-6" />,
    type: "link",
    href: "/vi",
  },
  {
    id: "search-chat",
    label: "Search Chat",
    icon: <Search className="size-6" />,
    type: "command",
  },
];

export const SidebarAction = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const handleActionClick = (action: typeof SIDE_BAR_ACTION[0]) => {
    if (action.type === "command") {
      setIsCommandOpen(true);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    // Xử lý khi chọn conversation
    console.log("Selected conversation from SidebarAction:", conversationId);
    // TODO: Navigate to conversation
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {SIDE_BAR_ACTION.map((action, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              {action.type === "link" ? (
                <Link
                  href={action.href || "/vi"}
                  className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-primary/20 cursor-pointer min-w-fit"
                >
                  {action.icon}
                  <span className="group-data-[collapsible=icon]:hidden truncate">
                    {action.label}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => handleActionClick(action)}
                  className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-primary/20 cursor-pointer min-w-fit w-full text-left"
                >
                  {action.icon}
                  <span className="group-data-[collapsible=icon]:hidden truncate">
                    {action.label}
                  </span>
                </button>
              )}
            </TooltipTrigger>
            <TooltipContent side="right" className="">
              <p>{action.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <SearchChatCommand
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        onSelectConversation={handleSelectConversation}
      />
    </>
  );
};

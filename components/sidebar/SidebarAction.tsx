import { Search, SquarePen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";

const SIDE_BAR_ACTION = [
  {
    label: "New Chat",
    icon: <SquarePen className="group-data-[collapsible=icon]:size-6 size-5" />,
  },
  {
    label:'Search Chat',
    icon:<Search className="group-data-[collapsible=icon]:size-6 size-5"/>
  }
];

export const SidebarAction = () => {
  return (
    <div className="flex flex-col gap-2 ">
      {SIDE_BAR_ACTION.map((e, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <Link href={'/vi'}
              className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-primary/20 cursor-pointer"
            >
              {e.icon}
              <span className="group-data-[collapsible=icon]:hidden">{e.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="">
            <p>{e.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

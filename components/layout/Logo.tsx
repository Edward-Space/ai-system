import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";

export const Logo = () => {
  return (
    <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:flex-col">
      <Link
        className="flex w-full text-center text-3xl font-bold text-primary group-data-[collapsible=icon]:hidden"
        href={`/`}
      >
       AI SYSTEM
      </Link>
   
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
    </div>
  );
};

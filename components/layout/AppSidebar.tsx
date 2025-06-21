import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { SidebarMenuFeatures } from "../sidebar/SidbarMenuFeatures";
import { SidebarAction } from "../sidebar/SidebarAction";

export function AppSidebar({ lang }: { lang: string }) {
  return (
    <Sidebar collapsible="icon" className="border-none bg-primary/20 ">
      <SidebarHeader className="h-fit pt-5 p-4 flex justify-between items-center">
        <Logo />
      </SidebarHeader>
      {/*  */}
      <SidebarContent className="hide-scrollbar h-full px-1 flex flex-col gap-5 ">
        <SidebarAction/>
        <SidebarMenuFeatures lang={lang} />
      </SidebarContent>
      {/*  */}
      <SidebarFooter className="p-2 border-t border-gray-200 dark:border-gray-800">
       
      </SidebarFooter>
    </Sidebar>
  );
}

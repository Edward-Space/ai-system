import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Download, MessageSquare, Plus, Settings } from "lucide-react";
import { SidebarMenu } from "../sidebar/SidbarMenu";

export function AppSidebar({ lang }: { lang: string }) {
  return (
    <Sidebar collapsible="icon" className="border-none bg-primary/20 ">
      <SidebarHeader className="h-fit pt-5 p-4 flex justify-between items-center">
        {/* <Logo />
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button> */}
      </SidebarHeader>
      <SidebarContent className="hide-scrollbar h-full">
        <SidebarMenu />
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          <span>Xuất lịch sử chat</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

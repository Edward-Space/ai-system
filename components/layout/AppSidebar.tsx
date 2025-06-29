import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { SidebarMenuFeatures } from "../sidebar/SidbarMenuFeatures";
import { SidebarAction } from "../sidebar/SidebarAction";
import { SidebarConversations } from "./SidebarConversations";
import { Suspense } from "react";
import { SidebarSetting } from "./SidebarSetting";
import { getValidToken } from "@/utils/tokenUtils";

export async function AppSidebar({ lang }: { lang: string }) {
  const token = await getValidToken();
  return (
    <>
      {token && (
        <Sidebar collapsible="icon" className="border-none bg-primary/20 ">
          <SidebarHeader className="h-fit p-0 pl-1 py-5  flex justify-between items-center">
            <Logo />
          </SidebarHeader>
          {/*  */}
          <SidebarContent className="hide-scrollbar h-full px-1 flex flex-col gap-5 ">
            <SidebarAction />
            <SidebarMenuFeatures lang={lang} />
            <Suspense>
              <SidebarConversations lang={lang} />
            </Suspense>
          </SidebarContent>
          {/*  */}
          <SidebarFooter className="p-0 pl-1 py-5 border-t border-gray-200 dark:border-gray-800">
            <SidebarSetting />
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}

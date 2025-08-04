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
        <Sidebar collapsible="icon" className="bg-secondary px-2 ">
          <SidebarHeader className="h-fit p-0 py-5">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="hide-scrollbar h-full flex flex-col gap-5 ">
            <SidebarAction />
            <SidebarMenuFeatures lang={lang} />
            <Suspense>
              <SidebarConversations lang={lang} />
            </Suspense>
          </SidebarContent>
          <SidebarFooter className="p-0 py-5 flex justify-between w-full items-start group-data-[collapsible=icon]:flex-col flex-row transition-all duration-300">
            <SidebarSetting />
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}

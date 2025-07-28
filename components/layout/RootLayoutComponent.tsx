import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { HeaderChat } from "./HeaderChat";

export const RootLayoutComponent = ({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider className="" defaultOpen={true}>
      <AppSidebar lang={lang} />
      <SidebarInset className="bg-secondary">
        <section
          className={`relative h-full w-full overflow-hidden p-2 lg:pl-0  `}
        >
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-primary/10 shadow-md  p-5">
            <HeaderChat />
            <Suspense>{children}</Suspense>
            {/* <FloatingSideBarMB/> */}
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};

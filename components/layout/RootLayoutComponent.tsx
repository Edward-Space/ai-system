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
      <SidebarInset className="bg-primary/20">
        <section 
          className={`relative h-full w-full overflow-hidden px-2 py-2 lg:p-2 `}
        >
          <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-primary/40 bg-white shadow-md dark:bg-accent-foreground p-5">
            <HeaderChat  />
            {children}
            {/* <FloatingSideBarMB/> */}
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};

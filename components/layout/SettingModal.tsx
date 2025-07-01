"use client";

import { SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GeneralTab } from "./GeneralTab";
import { AccountTab } from "./AccountTab";

const list_tabs = [
  {
    title: "Cài Đặt Chung",
    value: "general",
    component: <GeneralTab/>,
  },
  {
    title: "Tài Khoản",
    value: "account",
    component: <AccountTab />,
  },
];

export const SettingModal = () => {
  return (
    <Dialog>
      <DialogTrigger className=" focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full cursor-pointer">
        <SettingsIcon /> Cài đặt
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cài đặt</DialogTitle>
        </DialogHeader>
        <div className="flex w-full  flex-col gap-6">
          <Tabs defaultValue={"general"}>
            <TabsList className="w-full mb-5">
              {list_tabs.map((e, idx) => (
                <TabsTrigger key={idx} value={e.value}>
                  {e.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tabs Content */}
            {list_tabs.map((e, idx) => (
              <TabsContent value={e.value} key={idx}>
               {e.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

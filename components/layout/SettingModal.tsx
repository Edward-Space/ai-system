"use client";

import { SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

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
        <div className="">
            
        </div>
      </DialogContent>
    </Dialog>
  );
};

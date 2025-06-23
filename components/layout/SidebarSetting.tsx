"use client";

import { Settings } from "lucide-react";
import { logout } from "@/action/AuthAction";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const SidebarSetting = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const isLogout = await logout();
    if (isLogout) {
      router.push("/vi/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="py-2 rounded-lg w-fit pr-5 hover:bg-primary/20 transition-all duration-300 px-2 cursor-pointer">
        <div className="flex gap-2 items-center">
          <Settings className="group-data-[collapsible=icon]:size-6 size-5" /> <span className="text-sm">Setting</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right">
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          Đăng Xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

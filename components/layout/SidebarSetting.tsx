"use client";

import { CircleUser, Headset, LogOut,  SettingsIcon } from "lucide-react";
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
      <DropdownMenuTrigger className="py-2 rounded-lg w-full pr-5 hover:bg-primary/20 transition-all duration-300 px-2 cursor-pointer">
        <div className="flex gap-2 items-center">
          <CircleUser className="group-data-[collapsible=icon]:size-6 size-6" />{" "}
          <span className="text-sm">Huỳnh Tấn Phát</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[200px]" side="top">
        <DropdownMenuItem className="cursor-pointer py-2">
          <SettingsIcon  /> Cài đặt
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2">
          <Headset  /> Hỗ trợ
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2" onClick={handleLogout}>
          <LogOut /> Đăng Xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

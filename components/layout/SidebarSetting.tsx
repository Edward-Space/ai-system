"use client";

import { CircleUser, Headset, LogOut, SettingsIcon } from "lucide-react";
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
      <DropdownMenuTrigger className="py-2 flex group-data-[collapsible=icon]:px-0 px-2 group-data-[collapsible=icon]:justify-center gap-2 items-center rounded-lg w-full hover:bg-primary/20 transition-all duration-300 cursor-pointer">
        <CircleUser className="group-data-[collapsible=icon]:size-7 size-6" />
        <span className="text-sm group-data-[collapsible=icon]:hidden">
          Huỳnh Tấn Phát
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[200px]" side="top">
        <DropdownMenuItem className="cursor-pointer py-2">
          <SettingsIcon /> Cài đặt
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2">
          <Headset /> Hỗ trợ
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer py-2"
          onClick={handleLogout}
        >
          <LogOut /> Đăng Xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

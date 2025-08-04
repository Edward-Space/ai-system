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
import { SettingModal } from "./SettingModal";
import { SidebarTrigger } from "../ui/sidebar";

export const SidebarSetting = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const isLogout = await logout();
    if (isLogout) {
      router.push("/vi/login");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-10 aspect-square hover:bg-primary/20 flex justify-center items-center rounded-lg cursor-pointer transition-all duration-300">
          <CircleUser className="group-data-[collapsible=icon]:size-7 size-7" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[200px] ml-2" side="top">
          {/* <DropdownMenuItem className="cursor-pointer py-2"> */}
          <SettingModal />
          {/* </DropdownMenuItem> */}
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


      <SidebarTrigger className="bg-transparent hover:bg-primary/20 transition-all duration-300 cursor-pointer shadow-none text-primary rounded-full"/>
    </>
  );
};

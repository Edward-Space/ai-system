"use client";

import { IBot } from "@/model/bot";
import { useUpdateBot } from "@/swr/useUpdateBot";
import { useDeleteBot } from "@/swr/useDeleteBot";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CircleX, Ellipsis, LoaderCircle, Save, Share } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface IProps {
  bot: IBot;
}
/* ------------------------------------------------------------------------------------ */
export const DetailBotAction = ({ bot }: IProps) => {
  /* ------------------------------------------------------------------------------------ */
  const router = useRouter();
  const { updateBot, isUpdating, error } = useUpdateBot();
  const { deleteBot, isDeleting, error: deleteError } = useDeleteBot();
  /* ------------------------------------------------------------------------------------ */
  const handleSaveBot = async () => {
    if (!bot.id) {
      toast.error("Không tìm thấy ID bot");
      return;
    }

    const success = await updateBot(bot.id, bot);

    if (success) {
      toast.success("Cập nhật bot thành công");
      router.push("/vi/management-bot");
    } else {
      toast.error(error || "Có lỗi xảy ra khi cập nhật bot");
    }
  };
  
  const handleDeleteBot = async () => {
    if (!bot.id) {
      toast.error("Không tìm thấy ID bot");
      return;
    }

    const success = await deleteBot(bot.id);

    if (success) {
      toast.success("Xóa bot thành công");
      router.push("/vi/management-bot");
    } else {
      toast.error(deleteError || "Có lỗi xảy ra khi xóa bot");
    }
  };
  /* ------------------------------------------------------------------------------------ */
  return (
    <div className="flex gap-3 items-center">
      <Button
        className="w-[100px] cursor-pointer"
        onClick={handleSaveBot}
        disabled={isUpdating}
      >
        {isUpdating ? <LoaderCircle className="animate-spin" /> : <Save />}
        <span>Lưu</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size={'icon'} variant={'secondary'}><Ellipsis /></Button>
        </DropdownMenuTrigger>
        {/*  */}
        <DropdownMenuContent className="w-[200px]" align="end">
          <DropdownMenuItem className="py-2 cursor-pointer">
            <Share />
            <span>Xuất Agent</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="py-2 cursor-pointer"
            onClick={handleDeleteBot}
            disabled={isDeleting}
          >
            {isDeleting ? <LoaderCircle className="animate-spin" /> : <CircleX />}
            <span>{isDeleting ? "Đang xóa..." : "Xóa Agent"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { useDeleteConversation } from "@/swr/useDeleteConversation";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteConversationModal = () => {
  const search = useSearchParams();
  const router = useRouter();
  const conversation_id = search.get("session_id");
  const [isOpen, setIsOpen] = useState(false);
  
  const { deleteConversation, isDeleting, error, resetError } = useDeleteConversation();
  
  const handleDelete = async () => {
    if (!conversation_id) {
      toast.error("Không tìm thấy ID cuộc trò chuyện");
      return;
    }
    
    const success = await deleteConversation(conversation_id);
    
    if (success) {
      toast.success("Xóa cuộc trò chuyện thành công");
      setIsOpen(false);
      // Redirect về trang chính sau khi xóa
      router.push("/vi");
    } else {
      toast.error(error || "Có lỗi xảy ra khi xóa cuộc trò chuyện");
    }
  };
  
  const handleCancel = () => {
    setIsOpen(false);
    resetError();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {" "}
        <Button
          className="rounded-full bg-red-400 group hover:w-[100px] hover:bg-red-500 transition-all duration-300 cursor-pointer"
          size={"icon"}
        >
          <span className="group-hover:block hidden transition-all duration-300">
            Xóa
          </span>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-xl">
        {/*  */}
        <DialogHeader>
          <DialogTitle> Xóa cuộc trò chuyện </DialogTitle>
        </DialogHeader>
        {/*  */}
        <div className="w-full flex flex-col gap-3 ">
          <span>Bạn có chắc chắn muốn xóa cuộc trò chuyện này không? </span>
          <span>
            Lưu ý: Sau khi xóa, bạn không thể khôi phục lại cuộc trò chuyện này.
          </span>
        </div>
        <DialogFooter>
          <Button 
            className="rounded-full cursor-pointer" 
            variant={"secondary"}
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Hủy bỏ
          </Button>
          <Button
            className="rounded-full cursor-pointer"
            variant={"destructive"}
            onClick={handleDelete}
            disabled={isDeleting || !conversation_id}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

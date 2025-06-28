"use client";

import { Share } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const ShareModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          className="rounded-full bg-primary/80 group hover:w-[100px] transition-all duration-300 cursor-pointer"
          size={"icon"}
        >
          <span className="group-hover:block hidden transition-all duration-300">
            Chia sẻ
          </span>
          <Share />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-xl">
        {/*  */}
        <DialogHeader>
          <DialogTitle> Chia sẻ</DialogTitle>
        </DialogHeader>
        {/*  */}
        <div className="w-full flex flex-col gap-5 ">
          <span>
            Mọi tin nhắn bạn thêm sau khi chia sẻ sẽ hiển thị với các thành viên
            trong không gian làm việc của bạn. Tìm hiểu thêm
          </span>

          <div className="w-full rounded-full bg-primary/10  flex justify-between items-center">
            <span className="pl-5 text-sm">https://chatgpt.com/share/…</span>
            <Button className="rounded-full h-12 cursor-pointer bg-primary/60">
              Sao Chép Liên Kết
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { IDetailKnowledge } from "@/model/knowledge";

import { Bot, Undo2 } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";

export const DetailManagementKnowledge = ({
  data,
}: {
  data: IDetailKnowledge;
}) => {
  return (
    <div className=" flex flex-col gap-10">
      <div className="w-full flex justify-between items-center ">
        {/*  */}
        <div className="flex gap-3 items-center">
          <Link href={"/vi/management-bot"}>
            <Undo2 />
          </Link>
          <div className="size-12 rounded-lg bg-primary/20   flex justify-center items-center">
            <Bot className="size-7" />
          </div>
          <span className="text-base font-medium line-clamp-1">
            {data.name}
          </span>
        </div>
        {/*  */}
      </div>
      {/*  */}
      <div className="h-full grid grid-cols-1 lg:grid-cols-8 gap-5 ">
        <div className="lg:col-span-2 border h-[calc(100vh-150px)] rounded-xl flex flex-col gap-5 p-5">
          <Input
            className="w-full rounded-lg h-[42px] text-sm px-5"
            placeholder="Tìm Knowledge ..."
          />

          {data.data_sources.map((e, idx) => (
            <div
              key={idx}
              className="p-3 flex gap-2 items-center w-full bg-primary/20 rounded-lg"
            >
              <div className="min-w-10 aspect-square bg-primary rounded-md"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium line-clamp-1">
                  {e.local.file_name}
                </span>
                <span className="text-[10px] font-light text-black/50 line-clamp-1">
                  {e.local.file_size} KB | {e.status == 'processing' ? 'Đang xử lý' : 'Đã xử lý'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-6 border h-[calc(100vh-150px)] rounded-xl"></div>
      </div>
    </div>
  );
};

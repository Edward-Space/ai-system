"use client";
import { IBot } from "@/model/bot";
import { useGetModels } from "@/swr/useGetModels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Share, Trash } from "lucide-react";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import ClientOnly from "../common/ClientOnly";
import { useSelectModel } from "@/lib/store";
import React, { useEffect } from "react";
/* ------------------------------------------------------------------------------------ */
interface IProps {
  type?: "dashboard" | "agent" | "testing";
  bot?: IBot;
}
/* ------------------------------------------------------------------------------------ */
export const HeaderChat = ({ type = "dashboard", bot }: IProps) => {
  return (
    <div className="w-full flex flex-col lg:flex-row justify-between items-center pb-3 gap-3  ">
      <ClientOnly>
        {type === "dashboard" && <HeaderChatHome />}
        {type === "agent" && bot && <HeaderChatBot bot={bot} />}
      </ClientOnly>
    </div>
  );
};

const HeaderChatHome = React.memo(() => {
  const { data } = useGetModels();
  const token = getCookie("token");
  const { setSelectedModel } = useSelectModel();
  /* ------------------------------------------------------------------------------------ */
  useEffect(() => {
    if (data?.data?.[0]) {
      setSelectedModel(data?.data?.[0]);
    }
  }, [data]);
  /* ------------------------------------------------------------------------------------ */
  const handleChangeModel = (bot: string) => {
    const select = data?.data?.find((e) => e.model_id == bot);
    if (select) {
      setSelectedModel(select);
    }
  };
  /* ------------------------------------------------------------------------------------ */
  return (
    <>
      {data?.data && (
        <Select
          defaultValue={data?.data?.[0]?.model_id}
          onValueChange={(e) => handleChangeModel(e)}
        >
          <SelectTrigger className="min-w-[180px] border-none shadow-none cursor-pointer">
            <SelectValue placeholder="Select a agent" />
          </SelectTrigger>
          {/*  */}
          <SelectContent className="p-2 max-h-[300px] overflow-y-scroll rounded-lg">
            {data?.data?.map((item, idx) => (
              <SelectItem key={idx} value={item.model_id}>
                <div className="py-2 cursor-pointer">{item.model_name}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex gap-2 items-center">
        <Button
          className="rounded-full bg-primary/80 group hover:w-[100px] transition-all duration-300 cursor-pointer"
          size={"icon"}
        >
          <span className="group-hover:block hidden transition-all duration-300">
            Chia sẻ
          </span>
          <Share />
        </Button>
        {!token && (
          <Link href={"/vi/login"}>
            <Button className="rounded-full bg-white text-primary hover:text-white cursor-pointer border border-primary">
              <span>Đăng Nhập</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  );
});

const HeaderChatBot = React.memo(({ bot }: { bot: IBot }) => {
  /* ------------------------------------------------------------------------------------ */
  const { setSelectedModel } = useSelectModel();
  /* ------------------------------------------------------------------------------------ */
  useEffect(() => {
    if (bot?.active_models?.[0]) {
      setSelectedModel(bot?.active_models?.[0]);
    }
  }, [bot]);
  /* ------------------------------------------------------------------------------------ */
  const handleChangeModel = (model_id: string) => {
    const select = bot?.active_models?.find((e) => e.model_id == model_id);
    if (select) {
      setSelectedModel(select);
    }
  };
  /* ------------------------------------------------------------------------------------ */
  return (
    <>
      <div className="flex gap-2 items-center">
        <div className="size-12 min-w-12 rounded-full bg-primary/20"></div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{bot.name}</span>
          <span className="text-xs font-light italic text-black/50">
            @HuynhPhat | Published {bot.create_at}
          </span>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-end w-full lg:w-fit">
        {bot?.active_models && (
          <Select
            defaultValue={bot.active_models[0]?.model_id}
            onValueChange={(e) => handleChangeModel(e)}
          >
            <SelectTrigger className="min-w-[180px] border-none shadow-none cursor-pointer">
              <SelectValue placeholder="Select a agent" />
            </SelectTrigger>
            {/*  */}
            <SelectContent className="p-2 max-h-[300px] overflow-y-scroll rounded-lg">
              {bot?.active_models?.map((item, idx) => (
                <SelectItem key={idx} value={item.model_id}>
                  <div className="py-2 cursor-pointer">{item.model_name}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          className="rounded-full bg-primary/80 group hover:w-[100px] transition-all duration-300 cursor-pointer"
          size={"icon"}
        >
          <span className="group-hover:block hidden transition-all duration-300">
            Chia sẻ
          </span>
          <Share />
        </Button>
        <Button
          className="rounded-full bg-red-400 group hover:w-[100px] hover:bg-red-500 transition-all duration-300 cursor-pointer"
          size={"icon"}
        >
          <span className="group-hover:block hidden transition-all duration-300">
            Xóa
          </span>
          <Trash />
        </Button>
      </div>
    </>
  );
});

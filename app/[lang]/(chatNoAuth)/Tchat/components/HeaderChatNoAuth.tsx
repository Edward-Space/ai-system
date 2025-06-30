"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectModel } from "@/lib/store";
import { useGetModels } from "@/swr/useGetModels";
import { getCookie } from "cookies-next/client";
import { Share } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export const HeaderChatNoAuth = () => {
  const { data } = useGetModels();
  const token = getCookie("access_token");
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
    <div className=" lg:px-0 mx-auto py-5 w-full flex  justify-between items-center pb-3 gap-3  ">
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
    </div>
  );
};

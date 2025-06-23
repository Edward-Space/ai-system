"use client";

import { useGetListKnowledge } from "@/swr/useGetListKnowledge";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { ListKnowledge } from "./ListKnowledge";

export const ListKnowledgeSection = () => {
  const { data, isLoading } = useGetListKnowledge();

  console.log(data?.data);
  

  return <div className="flex flex-col gap-5 items-center justify-center w-full">
  <div className="w-full flex flex-col gap-3 justify-center max-w-[800px] text-center">
    <h2 className="text-2xl xl:text-4xl font-bold uppercase text-primary/80">
      Trung tâm AI Agent
    </h2>
    <span>
      Huấn luyện và phối hợp AI Agent để xử lý mọi kịch bản nghiệp vụ —
      nhanh chóng, thông minh và hiệu quả.
    </span>
    <Input placeholder="Tìm kiếm Knowledge" className="h-12 rounded-full" />
  </div>
  <ScrollArea className=" h-[600px] w-full">
    {isLoading && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 w-full ">
        {[1, 2, 3, 4, 5, 6,7, 8].map((e) => (
          <div
            className="w-full aspect-square  rounded-xl bg-primary/20 animate-pulse"
            key={e}
          ></div>
        ))}
      </div>
    )}
    <ListKnowledge knowledge={data?.data ?? []} />
  </ScrollArea>
</div>;
};

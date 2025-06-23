"use client";

import { cn } from "@/lib/utils";
import { IHistoryChatItem } from "@/model/chat";
import { useGetConversations } from "@/swr/useGetConversations";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export const SidebarConversations = ({ lang }: { lang: string }) => {
  const { data, mutate } = useGetConversations();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const DataHistoryChat: IHistoryChatItem[] = useMemo(() => {
    return [
      {
        key: "TODAY",
        title: "Hôm nay",
        history: data?.data
          ?.filter((item) => {
            const today = new Date();
            const createAt = new Date(item.create_at);
            return (
              createAt.toDateString() === today.toDateString() &&
              createAt.getTime() < today.getTime()
            );
          })
          .map((item) => ({
            key: item.id,
            title: item.title,
            bot_id: item.bot_id,
          })),
      },
      {
        key: "7_DAYS",
        title: "7 ngày qua",
        history: data?.data
          ?.filter((item) => {
            const today = new Date();
            const createAt = new Date(item.create_at);
            return (
              createAt.toDateString() !== today.toDateString() &&
              createAt.getTime() < today.getTime()
            );
          })
          .map((item) => ({
            key: item.id,
            title: item.title,
            bot_id: item.bot_id,
          })),
      },
    ];
  }, [data?.data]);

  useEffect(() => {
    mutate();
  }, [session_id]);
  // 
  return (
    <div className="p-2">
      {DataHistoryChat.map((item) => (
        <HistoryChatItem
          item={item}
          key={item.key}
          session_id={session_id?.toString() ?? ""}
          lang={lang}
        />
      ))}
    </div>
  );
};

const HistoryChatItem = ({
  item,
  session_id,
  lang,
}: {
  item: IHistoryChatItem;
  session_id: string;
  lang: string;
}) => {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-black/50">{item.title}</p>
      <div className="flex flex-col w-full gap-3 py-3">
        {item?.history?.map((item, index) => (
          <Link
            href={`/${lang}/bot/${item.bot_id}?session_id=${item.key}`}
            className={cn(
              "hover:text-main py-2 flex gap-2 cursor-pointer text-sm p-2 rounded-md hover:bg-primary/20 transition-all duration-300",
              session_id == item.key && "text-main bg-primary/20"
            )}
            key={index}
          >
            <div className="flex items-center justify-between">
              {item.title.length > 30
                ? item.title.slice(0, 30) + "..."
                : item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

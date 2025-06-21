import { IBot } from "@/model/bot";
import { Edit } from "lucide-react";
import Link from "next/link";

export const BotItem = ({ bot }: { bot: IBot }) => {
  return (
    <div className="w-full shadow-lg rounded-xl p-5 border border-primary/20 flex flex-col gap-5 h-full justify-between">
      <div className="flex flex-col gap-3">
        <div className="w-16 aspect-square bg-primary/20 rounded-lg"></div>
        <span className="line-clamp-2 text-sm font-medium">{bot.name}</span>
        <span className="line-clamp-3 text-sm font-light">
          {bot.description}
        </span>
      </div>
      {/*  */}
      <div className="w-full flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center text-sm font-light">
          <div className="w-8 aspect-square rounded-full bg-primary/20"></div>
          <span>Huỳnh Tấn Phát</span>
        </div>
        <Link href={'/'}><Edit/></Link>
      </div>
    </div>
  );
};

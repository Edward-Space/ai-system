import { IBot } from "@/model/bot";
import { BotItem } from "./BotItem";

export const ListBot = ({ bots }: { bots: IBot[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 items-stretch w-full  h-full">
      {bots.map((bot, idx) => (
        <BotItem bot={bot} key={idx} />
      ))}
    </div>
  );
};

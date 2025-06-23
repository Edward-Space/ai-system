"use client";
import { IBot } from "@/model/bot";
import { Textarea } from "../ui/textarea";

export const DetailBotPrompt = ({ bot }: { bot: IBot }) => {
  return (
    <div className="w-full rounded-xl border ">
      <Textarea
        className=" h-[83vh]  overflow-y-scroll p-5"
        value={bot.system_prompt}
      />
    </div>
  );
};

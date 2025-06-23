"use client";

import { IBot } from "@/model/bot";
import ChatSection from "../chat/ChatSection";
import { HeaderChat } from "../chat/HeaderChat";

export const DetailBotTesting = ({ bot }: { bot: IBot }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-5">
        <div className="w-full h-full border rounded-xl"></div>
      <div className="border p-5 h-full rounded-xl">
        <HeaderChat type="testing" bot={bot} />
        <ChatSection bot={bot} type="testing" />
      </div>
    </div>
  );
};

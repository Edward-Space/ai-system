"use client";

import { IBot } from "@/model/bot";
import ChatSection from "../chat/ChatSection";
import { HeaderChat } from "../chat/HeaderChat";

export const DetailBotTesting = ({ bot }: { bot: IBot }) => {
  /* ------------------------------------------------------------------------------------ */
  return (
      <div className="border p-5 h-full rounded-xl">
        <HeaderChat type="testing" bot={bot} />
        <ChatSection bot={bot} type="testing" />
      </div>
  );
};

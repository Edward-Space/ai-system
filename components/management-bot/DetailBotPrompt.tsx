"use client";
import { IBot } from "@/model/bot";
import { Textarea } from "../ui/textarea";
import React from "react";

export const DetailBotPrompt = React.memo(
  ({
    bot,
    onChange,
  }: {
    bot: IBot;
    onChange: (system_prompt: string) => void;
  }) => {
    return (
      <div className="w-full rounded-xl border ">
        <Textarea
          className=" h-[83vh]  overflow-y-scroll p-5"
          value={bot.system_prompt}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }
);

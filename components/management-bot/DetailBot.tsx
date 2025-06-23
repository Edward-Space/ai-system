"use client";

import { IBot } from "@/model/bot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DetailBotPrompt } from "./DetailBotPrompt";
import { DetailBotSetting } from "./DetailBotSetting";
import { DetailBotTesting } from "./DetailBotTesting";
import { useState } from "react";

const tabs_item = [
  {
    key: "prompt",
    title: "Prompt",
  },
  {
    key: "testing",
    title: "Kiểm tra",
  },
];
export const DetailManagementBot = ({ bot }: { bot: IBot }) => {
  const [botDetail, setBotDetail] = useState<IBot>(bot);
  //

  //
  return (
    <div className="w-full flex flex-col gap-5  ">
      <div className="h-[50px] bg-primary/20 rounded-xl w-full"></div>
      <Tabs defaultValue="prompt">
        <TabsList className="w-full">
          {tabs_item.map((item) => (
            <TabsTrigger key={item.key} value={item.key}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs_item.map((e, idx) => (
          <TabsContent key={idx} value={e.key}>
            {e.key == "prompt" && <DetailBotPrompt bot={botDetail} />}
            {e.key == "setting" && <DetailBotSetting bot={botDetail} />}
            {e.key == "testing" && <DetailBotTesting bot={botDetail} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

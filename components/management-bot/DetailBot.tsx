"use client";

import { IBot } from "@/model/bot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DetailBotPrompt } from "./DetailBotPrompt";
import { DetailBotSetting } from "./DetailBotSetting";
import { DetailBotTesting } from "./DetailBotTesting";
import { useState } from "react";
import { IModel } from "@/model/model";

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
export const DetailManagementBot = ({
  bot,
  models,
}: {
  bot: IBot;
  models: IModel[];
}) => {
  /* ------------------------------------------------------------------------------------ */
  const [botDetail, setBotDetail] = useState<IBot>(bot);
  /* ------------------------------------------------------------------------------------ */
  const handleChangeSystemPrompt = (system_prompt: string) => {
    setBotDetail((prev) => ({
      ...prev,
      system_prompt,
    }));
  };
  const handleChangeActiveModel = (active_model: string[]) => {
    const active: IModel[] = active_model.map((e) => ({
      model_id: e,
      model_name: models.find((model) => model.model_id == e)?.model_name ?? "",
    }));

    setBotDetail((prev) => ({
      ...prev,
      active_models: active,
    }));
  };
  /* ------------------------------------------------------------------------------------ */
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
            {e.key == "prompt" && (
              <DetailBotPrompt
                bot={botDetail}
                onChange={handleChangeSystemPrompt}
              />
            )}
            {e.key == "testing" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-5">
                <DetailBotSetting
                  models={models}
                  bot={botDetail}
                  handleChangeActiveModel={handleChangeActiveModel}
                />
                <DetailBotTesting bot={botDetail} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

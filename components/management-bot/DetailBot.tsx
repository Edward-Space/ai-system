"use client";

import { IBot, IPropsTextSetting } from "@/model/bot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DetailBotPrompt } from "./DetailBotPrompt";
import { DetailBotSetting } from "./DetailBotSetting";
import { DetailBotTesting } from "./DetailBotTesting";
import {  useState } from "react";
import { IModel } from "@/model/model";
import Link from "next/link";
import { Bot, Undo2 } from "lucide-react";
import { DetailBotAction } from "./DetailBotAction";

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
  const handleChangeSearchSetting = (token: number) => {
    setBotDetail((prev) => ({
      ...prev,
      knowledge_parameters: {
        ...prev.knowledge_parameters,
        source_chunks: token,
      },
    }));
  };
  const handleChangeTextSetting = (options: IPropsTextSetting) => {
    setBotDetail((prev) => ({
      ...prev,
      llm_parameters: options,
    }));
  };
  const handleChangeSearchType = (type: string) => {
    setBotDetail((prev) => ({
      ...prev,
      knowledge_parameters: {
        ...prev.knowledge_parameters,
        search_type: type,
      },
    }));
  };
  /* ------------------------------------------------------------------------------------ */
  return (
    <div className="w-full flex flex-col gap-5  ">
      <div className="w-full flex justify-between items-center ">
        {/*  */}
        <div className="flex gap-3 items-center">
          <Link href={"/vi/management-bot"}>
            <Undo2 />
          </Link>
          <div className="size-12 rounded-lg bg-primary/20   flex justify-center items-center">
            <Bot className="size-7" />
          </div>
          <span className="text-base font-medium line-clamp-1">
            {botDetail.name}
          </span>
        </div>
        {/*  */}
        <DetailBotAction bot={botDetail} />
      </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-5 h-full">
                <DetailBotSetting
                  models={models}
                  bot={botDetail}
                  handleChangeActiveModel={handleChangeActiveModel}
                  handleChangeSearchSetting={handleChangeSearchSetting}
                  handleChangeTextSetting={handleChangeTextSetting}
                  handleChangeSearchType={handleChangeSearchType}
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

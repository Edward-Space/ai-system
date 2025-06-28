"use client";

import { IBot, IPropsTextSetting } from "@/model/bot";
import { IModel } from "@/model/model";
import { MultiSelect, MultiSelectOption } from "../ui/multi-select";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface IProps {
  bot: IBot;
  models: IModel[];
  handleChangeActiveModel: (active_model: string[]) => void;
  handleChangeSearchSetting: (token: number) => void;
  handleChangeTextSetting: (options: IPropsTextSetting) => void;
}

export const DetailBotSetting = ({
  bot,
  models,
  handleChangeActiveModel,
  handleChangeSearchSetting,
  handleChangeTextSetting,
}: IProps) => {
  /* ------------------------------------------------------------------------------------ */
  const [selectModels, setSelectModels] = useState<string[]>(
    bot.active_models.map((e) => e.model_id)
  );
  /* ------------------------------------------------------------------------------------ */
  useEffect(() => {
    handleChangeActiveModel(selectModels);
  }, [selectModels]);
  /* ------------------------------------------------------------------------------------ */
  const options: MultiSelectOption[] =
    models?.map((category) => ({
      value: category.model_id,
      label: category.model_name,
    })) ?? [];
  /* ------------------------------------------------------------------------------------ */
  return (
    <div className="border p-5 h-full rounded-xl flex flex-col gap-5">
      <div className="">
        <MultiSelect
          options={options}
          selectedValues={selectModels}
          onChange={(values) => {
            setSelectModels(values);
          }}
          placeholder="Chọn Danh Mục .."
          triggerClassName="h-12" // Tùy chỉnh class cho nút trigger
          contentClassName="text-sm" // Tùy chỉnh class cho nội dung dropdown
        />
      </div>

      <SearchSetting
        bot={bot}
        handleChangeSearchSetting={handleChangeSearchSetting}
      />
      <TextSetting
        bot={bot}
        handleChangeTextSetting={handleChangeTextSetting}
      />
    </div>
  );
};

const SearchSetting = ({
  bot,
  handleChangeSearchSetting,
}: {
  bot: IBot;
  handleChangeSearchSetting: (token: number) => void;
}) => {
  const [count, setCount] = useState<number>(
    bot.knowledge_parameters.source_chunks
  );

  useEffect(() => {
    handleChangeSearchSetting(count);
  }, [count]);
  //
  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-medium capitalize">Search Settings</p>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-black/60">
          Độ dài vector tối đa
        </Label>
        <Slider
          onValueChange={(e) => setCount(e[0])}
          defaultValue={[4]}
          min={1}
          max={20}
          step={1}
        />
        <div className="w-full flex justify-between items-center text-xs">
          <span>{count}</span>
          <span>20</span>
        </div>
      </div>
    </div>
  );
};

const TextSetting = ({
  bot,
  handleChangeTextSetting,
}: {
  bot: IBot;
  handleChangeTextSetting: (options: IPropsTextSetting) => void;
}) => {
  const [count, setCount] = useState<IPropsTextSetting>(bot.llm_parameters);

  useEffect(() => {
    handleChangeTextSetting(count);
  }, [count]);

  const listSetting: {
    key: keyof IPropsTextSetting;
    title: string;
    min: number;
    max: number;
  }[] = [
    {
      key: "max_token",
      title: "Độ dài token tối đa",
      min: 1,
      max: 60000,
    },
    {
      key: "temperature",
      title: "Nhiệt độ",
      min: 0,
      max: 2,
    },
    {
      key: "top_k",
      title: "Top-k",
      min: 5,
      max: 100,
    },
    {
      key: "top_p",
      title: "Top-p",
      min: 0,
      max: 1,
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-medium capitalize">Search Settings</p>

      {listSetting.map((e, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-black/60">{e.title}</Label>
          <Slider
            onValueChange={(item) =>
              setCount({
                ...count,
                [e.key as keyof typeof count]: item[0],
              })
            }
            defaultValue={[count[e.key as keyof typeof count]]}
            min={e.min}
            max={e.max}
            step={1}
          />
          <div className="w-full flex justify-between items-center text-xs">
            <span>{count[e.key as keyof typeof count]}</span>
            <span>{e.max}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

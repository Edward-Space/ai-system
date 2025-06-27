"use client";

import { IBot } from "@/model/bot";
import { IModel } from "@/model/model";
import { MultiSelect, MultiSelectOption } from "../ui/multi-select";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface IProps {
  bot: IBot;
  models: IModel[];
  handleChangeActiveModel: (active_model: string[]) => void;
}

export const DetailBotSetting = ({
  bot,
  models,
  handleChangeActiveModel,
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

      <SearchSetting/>
    </div>
  );
};



const SearchSetting = () =>{


  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-medium capitalize">Search Settings</p>

      <div className="flex flex-col gap-1">
        <Label>Độ dài vector tối đa</Label>
        <Slider defaultValue={[33]} max={100} step={1} />
      </div>
    </div>
  )
}
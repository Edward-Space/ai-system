"use client";

import { IBot } from "@/model/bot";
import { IModel } from "@/model/model";
import { MultiSelect, MultiSelectOption } from "../ui/multi-select";
import { useEffect, useState } from "react";

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
    <div className="border p-5 h-full rounded-xl flex flex-col gap-3">
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
    </div>
  );
};

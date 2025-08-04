"use client";

import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const list_theme = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "Orange",
    value: "orange",
  },
  {
    label: "Green",
    value: "green",
  },
];

export const GeneralTab = () => {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex justify-between items-center">
        <p>Chủ đề:</p>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn chủ đề" />
          </SelectTrigger>
          <SelectContent>
            {list_theme.map((e, idx) => (
              <SelectItem key={idx} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

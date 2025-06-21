"use client";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Chọn các mục...",
  triggerClassName,
  contentClassName,
}: MultiSelectProps) {
  const refButton = useRef<any>(null);
  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const displayValue =
    selectedValues.length > 0
      ? options
          .filter((option) => selectedValues.includes(option.value))
          .map((option) => option.label)
          .join(", ")
      : placeholder;


      useEffect(() =>{
        console.log(refButton.current?.clientWidth);
        
      },[refButton])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={refButton}
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            selectedValues.length === 0 && "text-muted-foreground",
            triggerClassName
          )}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(" max-h-60 overflow-y-auto", contentClassName)}
        style={{
          width: `${refButton.current?.clientWidth}px`,
        }}
      >
        {options.length === 0 ? (
          <DropdownMenuLabel className="text-center text-muted-foreground py-2">
            Không có mục nào
          </DropdownMenuLabel>
        ) : (
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleSelect(option.value)}
              onSelect={(e) => e.preventDefault()} // Ngăn dropdown đóng khi chọn
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

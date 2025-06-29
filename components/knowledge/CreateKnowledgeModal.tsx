"use client";

import { FileType2, ImageIcon, LoaderCircle, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { createKnowledgeSchema, TCreateKnowledgeSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateKnowledge } from "@/swr/useCreateKnowledge";
import { toast } from "sonner";

const knowledge_type = [
  {
    id: "text-format",
    name: "Text Format",
  },
  {
    id: "image",
    name: "Image",
  },
];

interface IFormItem {
  name: keyof TCreateKnowledgeSchema;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  errorMessage?: string;
}
const form_item: IFormItem[] = [
  {
    name: "name",
    label: "Tên Trợ Lý",
    type: "text",
    placeholder: "Tên Trợ Lý",
    errorMessage: "Tên Trợ Lý không được để trống",
  },
  {
    name: "description",
    label: "Mô tả",
    type: "text",
    placeholder: "Mô tả",
    errorMessage: "Mô tả không được để trống",
  },
  {
    name: "import_type",
    label: "Import Type",
    type: "select",
    placeholder: "",
    errorMessage: "",
  },
];

const text_format_option = [
  {
    key: "local-document",
    label: "Local Document",
  },
  {
    key: "online-data",
    label: "Online Data",
  },
  {
    key: "database",
    label: "Database",
  },
];

const image_option = [
  {
    key: "local-image",
    label: "Local Image",
  },
];
export const CreateKnowledgeModal = () => {
  //
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [knowledgeType, setKnowledgeType] = useState<"text-format" | "image">(
    "text-format"
  );
  const { createKnowledge, isCreating, error, resetError } = useCreateKnowledge();

  // Cập nhật import_type khi knowledge type thay đổi
  const handleKnowledgeTypeChange = (type: "text-format" | "image") => {
    setKnowledgeType(type);
    const defaultImportType = type === "text-format" 
      ? text_format_option[0].key 
      : image_option[0].key;
    setValue("import_type", defaultImportType);
  };

  //
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TCreateKnowledgeSchema>({
    resolver: zodResolver(createKnowledgeSchema),
    defaultValues: {
      name: "",
      description: "",
      import_type: "",
    },
  });
  //
  const onSubmit = async (data: TCreateKnowledgeSchema) => {
    // Thêm knowledge type vào data
    const knowledgeData = {
      ...data,
      type: 'text',
    };
    
    const success = await createKnowledge(knowledgeData);
    
    if (success) {
      toast.success("Tạo knowledge thành công");
      setIsOpen(false);
      reset(); // Reset form
      resetError();
      // Reset knowledge type về mặc định
      setKnowledgeType("text-format");
    } else {
      toast.error(error || "Có lỗi xảy ra khi tạo knowledge");
    }
  };
  //
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger className="bg-primary/80 px-4 py-1 rounded-full text-white text-sm flex gap-2 justify-center items-center cursor-pointer hover:bg-primary">
        <PlusCircle />
        <span>Tạo Knowledge</span>
      </DialogTrigger>
      <DialogContent className="rounded-xl">
        <DialogTitle>Tạo Knowledge</DialogTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col gap-5"
        >
          <div className="grid grid-cols-2 gap-3">
            {knowledge_type.map((e, idx) => (
              <div
                key={idx}
                onClick={() =>
                    handleKnowledgeTypeChange(e.id as "text-format" | "image")
                  }
                className={cn(
                  "w-full border rounded-xl py-5 flex flex-col gap-2 items-center justify-center hover:border-primary/80 transition-all duration-300 cursor-pointer",
                  { "border-primary/80": knowledgeType == e.id }
                )}
              >
                <div className="w-20 aspect-square rounded-lg flex justify-center items-center bg-primary/20">
                  {e.id == "text-format" ? (
                    <FileType2 className="size-10" />
                  ) : (
                    <ImageIcon className="size-10" />
                  )}
                </div>
                <span className="text-lg font-semibold">{e.name}</span>
              </div>
            ))}
          </div>
          {form_item.map((e, idx) => (
            <div key={idx} className="grid w-full  items-center gap-3">
              <Label htmlFor={e.name}>{e.label}</Label>
              {e.type == "text" && (
                <>
                  <Input
                    key={idx}
                    {...register(e.name)}
                    placeholder={e.placeholder}
                    className="h-12 border-black/20 bg-white rounded-lg"
                  />
                  {errors[e.name] && (
                    <span className="text-red-500 text-xs">
                      {e.errorMessage}
                    </span>
                  )}
                </>
              )}
              {e.type == "select" && (
                <Select
                  defaultValue={
                    knowledgeType == "text-format"
                      ? text_format_option[0].key
                      : image_option[0].key
                  }
                  onValueChange={(value) => setValue("import_type", value)}
                >
                  <SelectTrigger className="w-full data-[size=default]:h-12 ">
                    <SelectValue className="h-12" placeholder={e.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {" "}
                    {(knowledgeType == "text-format"
                      ? text_format_option
                      : image_option
                    ).map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full rounded-full h-12 flex gap-2 items-center"
            disabled={isCreating}
          >
            {isCreating && <LoaderCircle className="animate-spin" />} 
            {isCreating ? "Đang tạo..." : "Tạo Knowledge"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

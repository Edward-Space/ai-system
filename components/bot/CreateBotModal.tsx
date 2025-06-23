"use client";

import { LoaderCircle, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useGetCategory } from "@/swr/useGetCategory";
import { MultiSelect, MultiSelectOption } from "../ui/multi-select";
import { useState } from "react";
import { AvatarUpload } from "../ui/avatar-upload";
import { useForm } from "react-hook-form";
import { createBotSchema, TCreateBotSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { handleCreateBot, handleCreateFile } from "@/action/ImageAction";
import { toast } from "sonner";
import { useGetListBot } from "@/swr/useGetListBot";
import { funcUtils } from "@/lib/funcUtils";
import { SWR_KEYS } from "@/lib/swr-key";

interface IFormItem {
  name: keyof TCreateBotSchema;
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
];
export const CreateBotModal = () => {
  const { data } = useGetCategory();
  const { mutate } = useGetListBot({ isFetch: false });
  //
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TCreateBotSchema>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  //
  const [avatar, setAvatar] = useState<File | null>(null);
  const [selectCategory, setSelectCategory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  //
  const options: MultiSelectOption[] =
    data?.data?.map((category) => ({
      value: category.id,
      label: category.name,
    })) ?? [];
  //
  const onSubmit = async (data: TCreateBotSchema) => {
    setIsLoading(true);
    try {
      const resp = avatar
        ? await handleCreateFile<{ data: { url: string } }>(avatar)
        : null;

      const payload = {
        name: data.name,
        description: data.description || "",
        category_ids: selectCategory || [],
        ...(resp && { avatar: resp.data.url }),
      };

      const upload = await handleCreateBot<{ data: { id: string } }>(payload);

      if ((upload as { data: { id: string } }).data) {
        toast.success("Tạo trợ lý thành công");
        mutate({});
      }
    } catch (e) {
      toast.success("Tạo trợ lý thất bại");
    } finally {
      setIsLoading(false);

      setIsOpen(false)
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger className="bg-primary/80 px-4 py-1 rounded-full text-white text-sm flex gap-2 justify-center items-center cursor-pointer hover:bg-primary">
        <PlusCircle />
        <span>Tạo Bot</span>
      </DialogTrigger>
      <DialogContent className="rounded-xl">
        <DialogTitle>Tạo Bot</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="h-full">
          <div className="flex flex-col gap-5 w-full">
            <AvatarUpload size="xl" onChange={(file) => setAvatar(file)} />
            <MultiSelect
              options={options ?? []}
              selectedValues={selectCategory}
              onChange={(values) => setSelectCategory(values)}
              placeholder="Chọn Danh Mục .."
              triggerClassName="h-12" // Tùy chỉnh class cho nút trigger
              contentClassName="text-sm" // Tùy chỉnh class cho nội dung dropdown
            />

            {form_item.map((e, idx) => (
              <div key={idx} className="grid w-full  items-center gap-3">
                <Label htmlFor={e.name}>{e.label}</Label>
                <Input
                  key={idx}
                  {...register(e.name)}
                  {...e}
                  className="h-12 border-black/20 bg-white rounded-lg"
                />
                {errors[e.name] && (
                  <span className="text-red-500 text-xs">{e.errorMessage}</span>
                )}
              </div>
            ))}
            <Button
              type="submit"
              className="w-full rounded-full h-12 flex gap-2 items-center"
            >
              {isLoading && <LoaderCircle className="animate-spin" />} Tạo Bot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

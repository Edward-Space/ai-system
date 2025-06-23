"use client";
import { useForm } from "react-hook-form";
import { loginSchema, TLoginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { auth_service } from "@/service/Auth";
import { LoaderCircle } from "lucide-react";
import { actionLogin } from "@/action/AuthAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface IFormItem {
  name: keyof TLoginSchema;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  errorMessage?: string;
}
export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: TLoginSchema) => {
    setIsLoading(true);
    try {
      const login = await auth_service.login(data);

      if (login?.data) {
        await actionLogin(login?.data);
      }
      console.log("login", login);

      toast.success("Đăng nhập thành công");
    } catch (e) {
      toast.error("Đăng nhập thất bại");
    } finally {
      setIsLoading(false);

      router.push("/vi");
    }
  };

  const form_item: IFormItem[] = [
    {
      name: "username",
      label: "Tên đăng nhập",
      type: "text",
      placeholder: "Tên đăng nhập",
      required: true,
      errorMessage: "Tên đăng nhập không được để trống",
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "Mật khẩu",
      required: true,
      errorMessage: "Mật khẩu không được để trống",
    },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <fieldset
        disabled={isLoading}
        className="flex flex-col gap-7 w-full h-full"
      >
        {form_item.map((e, idx) => (
          <div key={idx} className="grid w-full  items-center gap-3">
            <Label htmlFor={e.name}>{e.label}</Label>
            <Input
              key={idx}
              {...register(e.name)}
              placeholder={e.placeholder}
              type={e.type}
              className="h-12 border-black/20 bg-primary/20 rounded-full"
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
          {isLoading && <LoaderCircle className="animate-spin" />} Đăng Nhập
        </Button>
      </fieldset>
    </form>
  );
};

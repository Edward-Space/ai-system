import { LoginForm } from "@/components/login/LoginForm";
import loginImage from "@/assets/LOGIN.webp";
import Image from "next/image";
import { Meteors } from "@/components/magicui/meteors";
export default function LoginPage() {
  return (
    <div className=" h-screen w-screen flex justify-center items-center bg-center bg-no-repeat bg-cover bg-primary/60 ">
      <div className="max-w-[75vw] w-full h-[75vh] rounded-xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden backdrop-blur-3xl bg-white/40 ">
        <div className="w-full overflow-hidden bg-primary/10">
          <Image
            src={loginImage.src}
            width={500}
            height={600}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full  flex justify-center items-center relative overflow-hidden p-5">
          <Meteors number={100} />
          <div className="w-[100%] h-[700px] flex flex-col gap-4 justify-center items-center">
            <h2 className="uppercase text-4xl font-bold">Đăng Nhập</h2>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

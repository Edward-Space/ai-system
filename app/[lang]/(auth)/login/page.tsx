import { LoginForm } from "@/components/login/LoginForm";
export default function LoginPage() {
  return (
    <div className=" h-screen w-screen flex justify-center items-center bg-center bg-no-repeat bg-cover bg-primary/20">
      <div className="max-w-[90vw] w-full min-h-[800px] border-8 border-primary/20 rounded-xl grid grid-cols-1 lg:grid-cols-2 bg-primary/20 backdrop-blur-2xl">
        <div className="w-full rounded-r-full shadow-2xl bg-primary/10"></div>
        <div className="w-full flex justify-center items-center">
          <div className="w-[80%] h-[700px] rounded-xl shadow-lg border border-[#f0f0f0]/60 flex flex-col gap-4 justify-center items-center p-5">
            <h2 className="uppercase text-4xl font-bold">Đăng Nhập</h2>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

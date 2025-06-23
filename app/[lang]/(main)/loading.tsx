import { Loader } from "lucide-react";

export default function LoadingHomePage() {
  return (
    <div className="absolute top-0 w-full h-full bg-white flex justify-center items-center">
        <Loader className="size-20 animate-spin text-primary/20"/>
    </div>
  );
}

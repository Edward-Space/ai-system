import Link from "next/link";
import LOGO from "@/assets/LOGO.png";
import Image from "next/image";
export const Logo = () => {
  return (
      <Link
        className="flex w-full text-center items-center group-data-[collapsible=icon]:hover:bg-primary/20 rounded-lg text-3xl  font-bold text-primary group-data-[collapsible=icon]:aspect-square"
        href={`/vi`}
      >
        <Image src={LOGO.src} alt="Logo Fash Chat" width={50} height={50} />
        <span className="text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">Jaguar Chat</span>
      </Link>
  );
};

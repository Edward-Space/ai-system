import Link from "next/link";
export const Logo = () => {
  return (
    <Link
      className="w-full h-[50px] bg-primary/70 hover:bg-primary transition-all duration-300 rounded-lg"
      href={`/vi`}
    >
    </Link>
  );
};

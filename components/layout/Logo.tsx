import Link from "next/link";

export const Logo = () => {
  return (
    <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:flex-col">
      <Link
        className="flex w-full text-center text-3xl font-bold text-primary group-data-[collapsible=icon]:hidden"
        href={`/vi`}
      >
       AI SYSTEM
      </Link>
    </div>
  );
};

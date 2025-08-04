import { IKnowledge } from "@/model/knowledge";
import { FileType2, Image } from "lucide-react";
import Link from "next/link";

export const KnowledgeItem = ({ knowledge }: { knowledge: IKnowledge }) => {
  return (
    <Link
      href={"/vi/management-knowledge/" + knowledge.id}
      className="w-full shadow-lg rounded-xl p-5 border border-primary/20 flex flex-col gap-5 h-full justify-between"
    >
      <div className="flex gap-2 items-start">
        <div className="size-14 min-w-14 rounded-xl bg-primary/20 flex justify-center items-center">
          {knowledge.type == "text" ? (
            <FileType2 className="size-7" />
          ) : (
            <Image className="size-7" />
          )}
        </div>
        <div className="flex flex-col py-1">
          <span className="font-medium line-clamp-2 text-sm">
            {knowledge.name}
          </span>
          <span className="text-xs italic text-black/50 font-light">
            Published {knowledge.create_at}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 justify-between gap-1">
        <span className="text-sm font-light text-black/50 line-clamp-3">
          {knowledge.description}
        </span>
      </div>
    </Link>
  );
};

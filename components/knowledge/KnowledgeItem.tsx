import { IKnowledge } from "@/model/knowledge";

export const KnowledgeItem = ({ knowledge }: { knowledge: IKnowledge }) => {
  return (
    <div className="w-full shadow-lg rounded-xl p-5 border border-primary/20 flex flex-col gap-5 h-full justify-between">
      <div className="flex gap-2 items-start">
        <div className="size-16 min-w-16 rounded-xl bg-primary/20"></div>
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
    </div>
  );
};

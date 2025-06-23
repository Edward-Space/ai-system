

import { IBot } from "@/model/bot";
import { IKnowledge } from "@/model/knowledge";
import { KnowledgeItem } from "./KnowledgeItem";

export const ListKnowledge = ({ knowledge }: { knowledge: IKnowledge[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch w-full  h-full">
      {knowledge.map((knowledge, idx) => (
        <KnowledgeItem knowledge={knowledge} key={idx} />
      ))}
    </div>
  );
};

import { CreateNewKnowledge } from "@/components/knowledge/CreateNewKnowledge";
import { SearchParams } from "@/model";

export default async function CreateKnowledgePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; knowledge_id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang, knowledge_id } = await params;
  const { type } = await searchParams;
  return <div>
    <CreateNewKnowledge/>
  </div>;
}

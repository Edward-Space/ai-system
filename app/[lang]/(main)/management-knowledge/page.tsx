import { CreateKnowledgeModal } from "@/components/knowledge/CreateKnowledgeModal";
import { ListKnowledgeSection } from "@/components/knowledge/ListKnowledgeSection";

export default async function ManagementKnowledgePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="h-full flex flex-col gap-5 justify-between">
      <div className="h-[50px] w-full rounded-xl flex justify-end">
        <CreateKnowledgeModal />
      </div>

      <ListKnowledgeSection />
    </div>
  );
}

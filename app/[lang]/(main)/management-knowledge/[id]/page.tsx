import { DetailManagementKnowledge } from "@/components/knowledge/DetailManagementKnowledge";
import { IDetailKnowledge } from "@/model/knowledge";
import { GET } from "@/service/api";

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function DetailKnowledge({ params }: IProps) {
  const { id } = await params;
  const knowledge = await GET<{ data: IDetailKnowledge }>(
    "/api/v1/knowledges/" + id
  );

  return knowledge?.data ? (
    <DetailManagementKnowledge data={knowledge.data} />
  ) : (
    <div>Loading...</div>
  );
}

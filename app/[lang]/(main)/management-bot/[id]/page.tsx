import { DetailManagementBot } from "@/components/management-bot/DetailBot";
import { IBot } from "@/model/bot";
import { IModel } from "@/model/model";
import { GET } from "@/service/api";

export default async function ManagementBotIdPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id } = await params;

  const bot_detail = await GET<{ data: IBot }>("/api/v1/bots/" + id);
  const llms = await GET<{ data: IModel[] }>('/api/v1/llms')

  if (!bot_detail?.data) return <div>Không tìm thấy bot</div>;
  return (
    <div>
      <DetailManagementBot bot={bot_detail?.data}  models={llms?.data ?? []}/>
    </div>
  );
}

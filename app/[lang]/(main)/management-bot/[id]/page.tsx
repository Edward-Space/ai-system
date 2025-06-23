import { DetailManagementBot } from "@/components/management-bot/DetailBot";
import { IBot } from "@/model/bot";
import { GET } from "@/service/api";

export default async function ManagementBotIdPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;

  const bot_detail = await GET<{ data: IBot }>("/api/v1/bots/" + id);
  console.log(bot_detail?.data);

  if (!bot_detail?.data) return <div>Không tìm thấy bot</div>;
  return (
    <div>
      <DetailManagementBot bot={bot_detail?.data} />
    </div>
  );
}

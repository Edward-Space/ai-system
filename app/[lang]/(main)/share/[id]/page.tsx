import ChatSection from "@/components/chat/ChatSection";
import { HeaderChat } from "@/components/chat/HeaderChat";
import { SearchParams } from "@/model";
import { IBot } from "@/model/bot";
import { GET } from "@/service/api";
/* ------------------------------------------------------------------------------------ */
const getData = async ({
  id,
}: {
  id: string;
}) => {
  const [bot] = await Promise.allSettled([
    GET<{ data: IBot }>("/api/v1/bots/" + id + '/view'),
  ]);
  /* ------------------------------------------------------------------------------------ */
  return {
    bot: bot,
  };
};
/* ------------------------------------------------------------------------------------ */
export default async function BotIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; lang: string }>;
  searchParams: Promise<SearchParams>;
}) {
  /* ------------------------------------------------------------------------------------ */
  const { id, lang } = await params;
  const { session_id } = await searchParams;
  /* ------------------------------------------------------------------------------------ */
  const { bot } = await getData({
    id: id,
  });
  /* ------------------------------------------------------------------------------------ */
  if (bot.status == "rejected") {
    return null;
  }
  /* ------------------------------------------------------------------------------------ */
  return (
    <div className="h-[calc(100vh-60px)] overflow-y-hidden w-full">
      <HeaderChat type="agent" bot={bot.value?.data} />
      <ChatSection
        lang={lang}
        bot={bot.value?.data}
        type="agent"
        session_id={session_id && `${session_id}`}
      />
    </div>
  );
}

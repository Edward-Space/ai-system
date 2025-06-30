import ChatSection from "@/components/chat/ChatSection";
import { HeaderChat } from "@/components/chat/HeaderChat";
import { SearchParams } from "@/model";
import { IBot, IConversation } from "@/model/bot";
import { GET } from "@/service/api";
/* ------------------------------------------------------------------------------------ */
const getData = async ({
  id,
  session_id,
}: {
  id: string;
  session_id: string;
}) => {
  const [bot, conversation] = await Promise.allSettled([
    GET<{ data: IBot }>("/api/v1/bots/" + id),
    GET<{ data: IConversation }>("/api/v1/conversations/" + session_id),
  ]);
  /* ------------------------------------------------------------------------------------ */
  return {
    bot: bot,
    conversation: conversation,
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
  // const bot = await GET<{ data: IBot }>("/api/v1/bots/" + id);
  // const conversation =
  //   session_id &&
  //   (await GET<{ data: IConversation }>("/api/v1/conversations/" + session_id));
  const { bot, conversation } = await getData({
    id: id,
    session_id: `${session_id ?? ''}`,
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
        {...(session_id &&
          conversation && {
            conversations:
              conversation.status == "fulfilled"
                ? conversation.value?.data
                : undefined,
          })}
        session_id={session_id && `${session_id}`}
      />
    </div>
  );
}

import ChatSection from "@/components/chat/ChatSection";
import { HeaderChat } from "@/components/chat/HeaderChat";
import { SearchParams } from "@/model";
/* ------------------------------------------------------------------------------------ */
export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}) {
  /* ------------------------------------------------------------------------------------ */
  const { lang } = await params;
  const { session_id } = await searchParams;
  /* ------------------------------------------------------------------------------------ */
  return (
    <div className="h-[calc(100vh-60px)] overflow-y-hidden w-full">
      <HeaderChat />
      <div className="h-[calc(100vh-100px]">
        <ChatSection lang={lang} type="dashboard" session_id={session_id && `${session_id}`} />
      </div>
    </div>
  );
}

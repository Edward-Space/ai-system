import ChatSection from "@/components/chat/ChatSection";
import { SearchParams } from "@/model";
import { HeaderChatNoAuth } from "./components/HeaderChatNoAuth";

export default async function Tchat({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { session_id } = await searchParams;
  return (
    <div className=" overflow-y-hidden w-full max-w-5xl mx-auto px-2 lg:px-0">
      <HeaderChatNoAuth />
      <div className="h-[calc(100vh-70px)] flex items-end">
        <ChatSection
          lang={"vi"}
          type="dashboard"
          session_id={session_id && `${session_id}`}
        />
      </div>
    </div>
  );
}

import { CreateBotModal } from "@/components/bot/CreateBotModal";
import { ListBotSection } from "@/components/bot/ListBotSection";
/* ------------------------------------------------------------------------------------ */
export default async function ManagementBotPage() {
  return (
    <div className="h-full flex flex-col gap-5 justify-between">
      {/* Header Bot */}
      <div className="h-[50px] w-full rounded-xl flex justify-end">
        <CreateBotModal/>
      </div>
      {/* List Bot */}
      <ListBotSection />
    </div>
  );
}

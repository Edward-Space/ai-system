import { Button } from "../ui/button";

export const FirstChatCTA = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">DeepSeek AI Assistant</h2>
      <p className="mb-6">Chào mừng bạn đến với trợ lý AI thông minh</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start text-left"
        >
          <span className="font-medium mb-1">Giải thích mã nguồn</span>
          <span className="text-sm text-muted-foreground">
            Phân tích và giải thích đoạn mã phức tạp
          </span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start text-left"
        >
          <span className="font-medium mb-1">Viết bài blog</span>
          <span className="text-sm text-muted-foreground">
            Tạo nội dung blog chất lượng cao
          </span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start text-left"
        >
          <span className="font-medium mb-1">Tóm tắt văn bản</span>
          <span className="text-sm text-muted-foreground">
            Tóm tắt nội dung dài thành điểm chính
          </span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start text-left"
        >
          <span className="font-medium mb-1">Trả lời câu hỏi</span>
          <span className="text-sm text-muted-foreground">
            Giải đáp thắc mắc về nhiều lĩnh vực
          </span>
        </Button>
      </div>
    </div>
  );
};

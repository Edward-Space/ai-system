"use client";

import { useEffect } from "react";
import { MessageSquare, Clock } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";

// Mock data cho search results
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    title: "Hướng dẫn sử dụng React",
    lastMessage: "Cảm ơn bạn đã giải thích về hooks",
    timestamp: "2 giờ trước",
  },
  {
    id: "2", 
    title: "Thiết kế UI/UX",
    lastMessage: "Màu sắc này rất phù hợp",
    timestamp: "1 ngày trước",
  },
  {
    id: "3",
    title: "Tối ưu hiệu suất",
    lastMessage: "Code đã chạy nhanh hơn nhiều",
    timestamp: "3 ngày trước",
  },
  {
    id: "4",
    title: "API Integration",
    lastMessage: "Kết nối thành công với database",
    timestamp: "1 tuần trước",
  },
];

interface SearchChatCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectConversation?: (conversationId: string) => void;
}

export const SearchChatCommand = ({
  open,
  onOpenChange,
  onSelectConversation,
}: SearchChatCommandProps) => {
  const handleSelectConversation = (conversationId: string) => {
    // Xử lý khi chọn conversation
    console.log("Selected conversation:", conversationId);
    onOpenChange(false);
    
    // Gọi callback nếu có
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    }
    
    // TODO: Navigate to conversation
  };

  // Thêm keyboard shortcut Command + K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Kiểm tra Command + K (macOS) hoặc Ctrl + K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    // Thêm event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenChange]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tìm kiếm cuộc trò chuyện"
      description="Tìm kiếm trong lịch sử cuộc trò chuyện của bạn"
    >
      <CommandInput placeholder="Nhập từ khóa để tìm kiếm... (⌘K)" />
      <CommandList>
        <CommandEmpty>Không tìm thấy cuộc trò chuyện nào.</CommandEmpty>
        <CommandGroup heading="Cuộc trò chuyện gần đây">
          {MOCK_CONVERSATIONS.map((conversation) => (
            <CommandItem
              key={conversation.id}
              onSelect={() => handleSelectConversation(conversation.id)}
              className="flex items-center gap-3 p-3"
            >
              <MessageSquare className="size-4 text-blue-500" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {conversation.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {conversation.lastMessage}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {conversation.timestamp}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
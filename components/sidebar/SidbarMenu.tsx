'use client'

import { MessageSquare, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { Message } from "@/model/chat"



export const SidebarMenu = () =>{
    const [messages, setMessages] = useState<Message[]>([]);

    // Lấy lịch sử chat từ localStorage khi component được mount
    useEffect(() => {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          if (Array.isArray(parsedMessages)) {
            setMessages(parsedMessages);
          }
        } catch (error) {
          console.error("Error parsing saved messages:", error);
        }
      }
    }, []);
    return (
        <>
         <div className="p-4">
          <Button className="w-full justify-start gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            <span>Cuộc trò chuyện mới</span>
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {messages.length > 0 ? (
              // Nhóm tin nhắn theo cuộc hội thoại
              <div className="space-y-1">
                {Array.from(new Set(messages.map(m => m.timestamp.toString().slice(0, 10)))).map((date, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="text-xs text-muted-foreground mb-1 px-2">
                      {new Date(parseInt(date + '000')).toLocaleDateString()}
                    </div>
                    {messages
                      .filter(m => m.timestamp.toString().slice(0, 10) === date && m.role === 'user')
                      .map((message) => (
                        <Button 
                          key={message.id} 
                          variant="ghost" 
                          className="w-full justify-start text-left truncate py-2 h-auto"
                        >
                          <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                          <span className="truncate text-sm">
                            {message.content.slice(0, 30)}{message.content.length > 30 ? '...' : ''}
                          </span>
                        </Button>
                      ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-2 py-4 text-center text-muted-foreground">
                <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
              </div>
            )}
          </div>
        </ScrollArea>
        </>
    )
}
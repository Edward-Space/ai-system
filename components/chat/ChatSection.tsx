"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLLMOutput } from "@llm-ui/react";
import { markdownLookBack } from "@llm-ui/markdown";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { MarkdownComponent } from "./MarkdownComponent";
import AutoResizeTextarea from "./AutoResizeTextarea";
import { FormData, IMessage, StreamingState } from "@/model/chat";
import { useGenId } from "@/hooks/useGenID";
import { RenderMessage } from "./RenderMessage";
import { LoadingStreaming } from "./LoadingSteaming";
import { ErrorStreaming } from "./ErrorSteaming";
import { FirstChatCTA } from "./FirstChatCTA";
import { IBot, IConversation } from "@/model/bot";
import { useRouter } from "next/navigation";
import { useSelectModel } from "@/lib/store";
import { cn } from "@/lib/utils";
/* ------------------------------------------------------------------------------------ */
interface IProps {
  type?: "dashboard" | "agent" | "testing";
  bot?: IBot;
  conversations?: IConversation;
  session_id?: string;
  lang?: string;
}
/* ------------------------------------------------------------------------------------ */
export default function ChatSection({
  type = "dashboard",
  bot,
  conversations,
  session_id,
}: IProps) {
  /* ------------------------------------------------------------------------------------ */
  const route = useRouter();
  /* ------------------------------------------------------------------------------------ */
  const { selectedModel } = useSelectModel();
  /* ------------------------------------------------------------------------------------ */
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    isError: false,
    errorMessage: "",
  });
  const [isStreamFinished, setIsStreamFinished] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const promptValue = watch("prompt");
  /* ------------------------------------------------------------------------------------ */
  const { blockMatches } = useLLMOutput({
    llmOutput: streamingContent,
    isStreamFinished,
    fallbackBlock: {
      component: MarkdownComponent,
      lookBack: markdownLookBack(),
    },
  });
  /* ------------------------------------------------------------------------------------ */
  // Hủy request khi cần
  const cancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setStreamingState({
        isStreaming: false,
        isError: false,
        errorMessage: "",
      });
      setIsStreamFinished(true);
    }
  };
  const onSubmit = async (data: FormData) => {
    const userPrompt = data?.prompt?.trim();
    if (!userPrompt) return;
    // Hủy stream hiện tại nếu có
    if (abortControllerRef.current) {
      cancelStream();
    }
    // Thêm tin nhắn người dùng với ID và timestamp
    setMessages((prev) => [
      ...prev,
      {
        id: useGenId(),
        role: "user",
        content: userPrompt,
        timestamp: Date.now(),
      },
    ]);
    reset();
    // Thêm một khoảng dừng nhỏ trước khi bắt đầu streaming để tạo hiệu ứng tự nhiên
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Reset trạng thái streaming
    setStreamingContent("");
    setStreamingState({
      isStreaming: true,
      isError: false,
      errorMessage: "",
    });
    setIsStreamFinished(false);

    // Tạo AbortController mới
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const payload = {
        bot: bot,
        bot_id: bot?.id,
        generative_model: selectedModel?.model_id ?? "google/gemini-2.5-pro",
        session_id: session_id,
        ...(type != "agent" && { type: type }),
        ...(type !== "dashboard" && {
          system_prompt: bot?.system_prompt ?? "",
        }),
        prompt: userPrompt,
      };

      // Gọi API với signal để có thể hủy
      const response = await fetch(
        "https://api-gateway.newweb.vn/api/v1/chat/dashboard/sse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2QwMDQyNTZlMWY4MWQzNzUwMGQ4OSIsInVzZXJfaWQiOiIiLCJ0ZWFtX2lkIjoiNjgzYTdjNTBiNTYxZGI1ZmVlNDZjODcxIiwicGhvbmVfbnVtYmVyIjoiMDkxNjIxNTE4MCIsImVtYWlsIjoicGhhdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InBoYXQiLCJpc3MiOiJiZjIyMzkwNy05NDg1LTRhNmYtODU2Zi00Yzg5MzAyYzA4NzQiLCJzdWIiOiI2ODNkMDA0MjU2ZTFmODFkMzc1MDBkODkiLCJleHAiOjE3NTAzODcxMzEsIm5iZiI6MTc1MDMwMDczMSwiaWF0IjoxNzUwMzAwNzMxfQ.aLZsFz3krUd64rLLLmR8RZ488jm-6piav6TSBx1o7Os",
          },
          body: JSON.stringify(payload),
          signal,
          credentials: "include", // Tương đương withCredentials: true trong axios
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }
      let textBuffer = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Xử lý stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.trim().split("\n");
        setStreamingContent((prev) => prev + chunk);
        //
        lines
          .filter(
            (line) =>
              line.trim().startsWith("data:") &&
              JSON.parse(line.replace(/^data:\s*/, ""))
          )
          // Tách bỏ phần tiền tố "data:" và parse JSON
          .map((line) => {
            if (!line) return;
            const jsonPart = line.replace(/^data:\s*/, "");
            try {
              const json = JSON.parse(jsonPart);

              if (!session_id && json.session_id && type != "testing") {
                route.replace(`?session_id=${json.session_id}`);
              }
              if (Object.keys(json).length === 0) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: useGenId(),
                    role: "assistant",
                    content: textBuffer,
                    timestamp: Date.now(),
                  },
                ]);
                setIsStreamFinished(true);
              }
              if (
                json.content !== undefined &&
                json.event_type == "step_update"
              ) {
                setStreamingContent(json.content);
              }
              if (json.content !== undefined && json.event_type == "response") {
                textBuffer += json.content;
                setStreamingContent(textBuffer);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          });
      }

      // Hoàn thành stream
      setIsStreamFinished(true);
      // Thêm tin nhắn assistant vào danh sách với ID và timestamp

      // Reset trạng thái streaming
      setStreamingState({
        isStreaming: false,
        isError: false,
        errorMessage: "",
      });
      setStreamingContent("");
    } catch (error) {
      // Xử lý lỗi
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error during streaming:", error);
        setStreamingState({
          isStreaming: false,
          isError: true,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
      setIsStreamFinished(true);
    } finally {
      abortControllerRef.current = null;
    }
  };
  /* ------------------------------------------------------------------------------------ */
  // Auto-scroll on new messages với animation mượt mà
  useEffect(() => {
    if (scrollRef.current) {
      // Sử dụng scrollIntoView với behavior: "smooth" để tạo hiệu ứng cuộn mượt mà
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  // Lưu tin nhắn vào localStorage khi messages thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
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
  useEffect(() => {
    const history: IMessage[] =
      conversations?.messages.map((e) => ({
        id: e.id,
        role: e.role as "user" | "assistant",
        content: e.content.content,
        timestamp: 0,
      })) ?? [];
    //
    setMessages(history);
  }, [conversations]);
  /* ------------------------------------------------------------------------------------ */
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center  w-full",
        {
          "h-[calc(100vh-100px)]": type !== "testing",
          "h-[calc(100vh-280px)]": type === "testing",
        }
      )}
    >
      {/* Chat Space */}
      <ScrollArea ref={scrollRef} className="h-[80%] pb-4 lg:p-4 w-full chat-scroll">
        <div className="space-y-6 transition-all duration-300">
          {messages.length === 0 && !streamingState.isStreaming && (
            <div className="animate-fade-in">
              <FirstChatCTA />
            </div>
          )}
          {/* Hiển thị tin nhắn với animation */}
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className="animate-fade-in streaming-content"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <RenderMessage message={message} />
            </div>
          ))}
          {/* Hiển thị nội dung đang streaming với animation */}
          {streamingState.isStreaming && (
            <div className="animate-fade-in streaming-content">
              <LoadingStreaming blockMatches={blockMatches} />
            </div>
          )}
          {/* Hiển thị lỗi nếu có */}
          {streamingState.isError && (
            <div className="animate-fade-in">
              <ErrorStreaming streamingState={streamingState} />
            </div>
          )}
        </div>
      </ScrollArea>
      {/* Input Space */}
      <div className="h-auto flex items-end  pb-5 w-full">
        <div className="max-w-5xl w-full mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-2"
          >
            <div className="flex flex-col gap-2 relative bg-secondary py-2 px-3  border border-gray-200  rounded-[24px] overflow-hidden shadow-sm">
              <AutoResizeTextarea
                {...register("prompt", { required: true })}
                placeholder="Nhập tin nhắn của bạn..."
                style={{ resize: "none" }}
                className="flex-1 min-h-[54px] py-4  border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={streamingState.isStreaming}
              />

              <div className="flex items-center justify-end">
                {streamingState.isStreaming ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={cancelStream}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 [&_svg:not([class*='size-'])]:size-7 size-10"
                  >
                    <X className="h-7  w-7 " />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="text-blue-500 hover:text-blue-600 bg-white cursor-pointer border rounded-full [&_svg:not([class*='size-'])]:size-5 size-10"
                    disabled={!promptValue?.trim()}
                  >
                    <Send className="h-7 w-7" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

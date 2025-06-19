"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLLMOutput } from "@llm-ui/react";
import {
  findCompleteCodeBlock,
  findPartialCodeBlock,
  codeBlockLookBack,
} from "@llm-ui/code";
import { markdownLookBack } from "@llm-ui/markdown";
import { Button } from "@/components/ui/button";
import { codeToHtml } from "shiki";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {  Send, Trash2, X, Share2 } from "lucide-react";
import { MarkdownComponent } from "./MarkdownComponent";
import AutoResizeTextarea from "./AutoResizeTextarea";
import { FormData, Message, StreamingState } from "@/model/chat";
import { useGenId } from "@/hooks/useGenID";
import { RenderMessage } from "./RenderMessage";
import { LoadingStreaming } from "./LoadingSteaming";
import { ErrorStreaming } from "./ErrorSteaming";
import { FirstChatCTA } from "./FirstChatCTA";

export default function ChatSection() {
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const [messages, setMessages] = useState<Message[]>([]);
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

  // Parse and render LLM output into blocks
  const { blockMatches } = useLLMOutput({
    llmOutput: streamingContent,
    isStreamFinished,
    fallbackBlock: {
      component: MarkdownComponent,
      lookBack: markdownLookBack(),
    },
    blocks: [
      {
        component: ({ blockMatch }) => {
          // Trích xuất ngôn ngữ và mã từ blockMatch.output
          const codeBlockRegex = /```([\w-]*)\s\n([\s\S]*?)```/;
          const match = blockMatch.output.match(codeBlockRegex);
          const language = match?.[1] || "";
          const code = match?.[2] || blockMatch.output;
          const [highlightedCode, setHighlightedCode] = useState<string>("");

          // Xử lý Promise từ codeToHtml
          useEffect(() => {
            let isMounted = true;

            if (code) {
              codeToHtml(code.trim(), {
                lang: language || "text",
                themes: {
                  light: "github-light",
                  dark: "github-dark",
                },
                defaultColor: "light",
              })
                .then((html) => {
                  if (isMounted) {
                    setHighlightedCode(html);
                  }
                })
                .catch((err) => {
                  console.error("Error highlighting code:", err);
                });
            }

            return () => {
              isMounted = false;
            };
          }, [code, language]);

          return <div className=""></div>;
        },
        findCompleteMatch: findCompleteCodeBlock(),
        findPartialMatch: findPartialCodeBlock(),
        lookBack: codeBlockLookBack(),
      },
    ],
  });

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
    await new Promise(resolve => setTimeout(resolve, 300));
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
        generative_model: "google/gemini-2.5-pro",
        type: "dashboard",
        system_prompt: "Bạn là một trợ lý AI thông minh hỗ trợ người dùng",
        prompt: userPrompt,
      };

      // Gọi API với signal để có thể hủy
      const response = await fetch(
        "https://api-gateway.newweb.vn/api/v1/chat/sse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2QwMDQyNTZlMWY4MWQzNzUwMGQ4OSIsInVzZXJfaWQiOiIiLCJ0ZWFtX2lkIjoiNjgzYTdjNTBiNTYxZGI1ZmVlNDZjODcxIiwicGhvbmVfbnVtYmVyIjoiMDkxNjIxNTE4MCIsImVtYWlsIjoicGhhdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InBoYXQiLCJpc3MiOiJiZjIyMzkwNy05NDg1LTRhNmYtODU2Zi00Yzg5MzAyYzA4NzQiLCJzdWIiOiI2ODNkMDA0MjU2ZTFmODFkMzc1MDBkODkiLCJleHAiOjE3NTAzODcxMzEsIm5iZiI6MTc1MDMwMDczMSwiaWF0IjoxNzUwMzAwNzMxfQ.aLZsFz3krUd64rLLLmR8RZ488jm-6piav6TSBx1o7Os",
          },
          body: JSON.stringify(payload),
          signal,
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

  // Auto-scroll on new messages với animation mượt mà
  useEffect(() => {
    if (scrollRef.current) {
      // Sử dụng scrollIntoView với behavior: "smooth" để tạo hiệu ứng cuộn mượt mà
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, streamingContent]);

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

  // Xóa lịch sử chat
  const clearChatHistory = () => {
    if (streamingState.isStreaming) {
      cancelStream();
    }
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="flex h-full">
      {/* Khu vực chính - Nội dung chat */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="border-b  border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
          <h1 className="font-semibold">Chat with DeepSeek</h1>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChatHistory}
                    disabled={
                      messages.length === 0 || streamingState.isStreaming
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xóa lịch sử chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chia sẻ cuộc trò chuyện</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Chat content với animation */}
        <ScrollArea ref={scrollRef} className="h-[80vh] p-4 ">
          <div className="space-y-6 transition-all duration-300">
            {messages.length === 0 && !streamingState.isStreaming && (
              <div className="animate-fade-in">
                <FirstChatCTA/>
              </div>
            )}
            {/* Hiển thị tin nhắn với animation */}
            {messages.map((message, index) => (
              <div 
                key={index} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RenderMessage message={message} />
              </div>
            ))}
            {/* Hiển thị nội dung đang streaming với animation */}
            {streamingState.isStreaming && (
              <div className="animate-fade-in">
                <LoadingStreaming blockMatches={blockMatches} />
              </div>
            )}
            {/* Hiển thị lỗi nếu có */}
            {streamingState.isError && (
              <div className="animate-fade-in">
                <ErrorStreaming streamingState={streamingState}/>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="max-w-5xl mx-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full gap-2"
            >
              <div className="flex gap-2 relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                <AutoResizeTextarea
                  {...register("prompt", { required: true })}
                  placeholder="Nhập tin nhắn của bạn..."
                  style={{ resize: "none" }}
                  className="flex-1 min-h-[56px] p-3 pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={streamingState.isStreaming}
                />

                <div className="flex items-center pr-2">
                  {streamingState.isStreaming ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={cancelStream}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      disabled={!promptValue?.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                DeepSeek AI có thể tạo ra thông tin không chính xác. Hãy kiểm
                tra thông tin quan trọng.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLLMOutput } from "@llm-ui/react";
import { markdownLookBack } from "@llm-ui/markdown";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, X } from "lucide-react";
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
import ChatUploadModal from "./ChatUploadModal";
import SpeechToText from "./SpeechToText";
import { funcUtils } from "@/lib/funcUtils";
/* ------------------------------------------------------------------------------------ */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const dashboard = "/api/v1/chat/dashboard/sse";
const other = "/api/v1/chat/sse";
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
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    isError: false,
    errorMessage: "",
  });
  const [isStreamFinished, setIsStreamFinished] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFileUrls, setSelectedFileUrls] = useState<string[]>([]);
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
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
    }
  };
  /* ------------------------------------------------------------------------------------ */
  // Handle replace message into chat input
  const handleReplaceMessage = (content: string) => {
    setValue("prompt", content);
    // Focus vào textarea sau khi set value
    const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      // Set cursor to end of text
      textarea.setSelectionRange(content.length, content.length);
    }
  };
  /* ------------------------------------------------------------------------------------ */
  // Handle file upload with URLs
  const handleFileSelect = (files: File[], urls: string[]) => {
    setSelectedFiles(files);
    setSelectedFileUrls(urls);
  };
  
  const handleImageSelect = (images: File[], urls: string[]) => {
    setSelectedImages(images);
    setSelectedImageUrls(urls);
  };
  /* ------------------------------------------------------------------------------------ */
  // Handle speech to text
  const handleSpeechToText = (transcript: string) => {
    const currentValue = watch("prompt") || "";
    const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;
    setValue("prompt", newValue);
    
    // Focus vào textarea sau khi set value
    const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      // Set cursor to end of text
      textarea.setSelectionRange(newValue.length, newValue.length);
    }
  };
  /* ------------------------------------------------------------------------------------ */
  const onSubmit = async (data: FormData) => {
    const userPrompt = data?.prompt?.trim();
    if (!userPrompt) return;
    // Hủy stream hiện tại nếu có
    if (abortControllerRef.current) {
      cancelStream();
    }
    /* ------------------------------------------------------------------------------------ */
    // Tạo nội dung tin nhắn bao gồm text và thông tin files
    let messageContent = userPrompt;
    if (selectedImages.length > 0 || selectedFiles.length > 0) {
      messageContent += "\n\n";
      if (selectedImages.length > 0) {
        messageContent += `📷 Images: ${selectedImages
          .map((img) => img.name)
          .join(", ")}\n`;
      }
      if (selectedFiles.length > 0) {
        messageContent += `📎 Files: ${selectedFiles
          .map((file) => file.name)
          .join(", ")}`;
      }
    }
    /* ------------------------------------------------------------------------------------ */
    // Chuẩn bị thông tin files để lưu vào message
    const messageFiles = [
      ...selectedImages.map((img, index) => ({
        name: img.name,
        url: selectedImageUrls[index] || URL.createObjectURL(img),
        type: 'image' as const,
        size: img.size,
      })),
      ...selectedFiles.map((file, index) => ({
        name: file.name,
        url: selectedFileUrls[index] || '',
        type: 'file' as const,
        size: file.size,
      }))
    ];

    // Thêm tin nhắn người dùng với ID và timestamp
    setMessages((prev) => [
      ...prev,
      {
        id: useGenId(),
        role: "user",
        content: userPrompt, // Chỉ lưu text prompt, không bao gồm thông tin files
        timestamp: Date.now(),
        files: messageFiles.length > 0 ? messageFiles : undefined,
      },
    ]);
    /* ------------------------------------------------------------------------------------ */
    // Reset form và files
    reset();
    setSelectedFiles([]);
    setSelectedImages([]);
    setSelectedFileUrls([]);
    setSelectedImageUrls([]);
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
    /* ------------------------------------------------------------------------------------ */
    try {
      // Tạo mảng URLs từ files và images đã upload
      const fileUrls = [...selectedFileUrls, ...selectedImageUrls];
      
      const payload = {
        bot_id: bot?.id,
        generative_model: selectedModel?.model_id ?? "google/gemini-2.5-pro",
        session_id: session_id,
        prompt: userPrompt,
        /* -------------------------------------------------------------------*/
        ...(fileUrls.length > 0 && { image_urls: fileUrls }),
        ...(type == "testing" && { bot: bot }),
        ...(type != "agent" && { type: type }),
      };
      /* -------------------------------------------------------------------*/
      // Gọi API với signal để có thể hủy
      const response = await fetch(
        `${BASE_URL}${type == "dashboard" ? dashboard : other}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + funcUtils.getToken(),
          },
          body: JSON.stringify(payload),
          signal,
          credentials: "include", // Tương đương withCredentials: true trong axios
        }
      );
      /* -------------------------------------------------------------------*/
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }
      /* -------------------------------------------------------------------*/
      let textBuffer = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      /* -------------------------------------------------------------------*/
      // Xử lý stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        /* -------------------------------------------------------------------*/
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.trim().split("\n");
        setStreamingContent("Thinking...");
        /* -------------------------------------------------------------------*/
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
              //
              if (!session_id && json.session_id && type != "testing") {
                route.replace(`?session_id=${json.session_id}`);
              }
              // 
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
              //
              if (json.event_type == "step_update") {
                setStreamingContent(json.status);
              }
              //
              if (json.content !== undefined && json.event_type == "response") {
                textBuffer += json.content;
                setStreamingContent(textBuffer);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          });
      }
      /* -------------------------------------------------------------------*/
      // Hoàn thành stream
      setIsStreamFinished(true);
      /* -------------------------------------------------------------------*/
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
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  // Load conversation
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
      className={cn("flex flex-1 flex-col items-center justify-center w-full", {
        "h-[calc(100vh-100px)]": type !== "testing",
        "h-[calc(100vh-280px)]": type === "testing",
      })}
    >
      {/* Chat Space */}
      <ScrollArea
        ref={scrollRef}
        className={`${
          selectedFiles.length > 0 || selectedImages.length > 0
            ? "h-[70%]"
            : "h-[80%]"
        } pb-4 lg:p-4 w-full chat-scroll`}
        style={{display:'block'}}
      >
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
              <RenderMessage 
                message={message} 
                onReplaceMessage={handleReplaceMessage}
              />
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-2 max-w-5xl mx-auto"
        >
          {/* File Preview Section */}
          {(selectedFiles.length > 0 || selectedImages.length > 0) && (
            <div className="flex flex-wrap gap-2 p-3 bg-primary/10 rounded-[24px] ">
              {/* Image Previews */}
              {selectedImages.map((image, index) => (
                <div key={`image-${index}`} className="relative group">
                  <div className="w-16 h-16 rounded-lg overflow-hidden  bg-white dark:bg-gray-700">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setSelectedImageUrls((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate rounded-b-lg">
                    {image.name}
                  </div>
                </div>
              ))}
              {/* File Previews */}
              {selectedFiles.map((file, index) => (
                <div key={`file-${index}`} className="relative group">
                  <div className="w-32 h-16 rounded-lg  bg-white dark:bg-gray-700 flex flex-col items-center justify-center p-2">
                    <div className="text-2xl mb-1">📄</div>
                    <div className="text-xs text-center truncate w-full">
                      {file.name.split(".").pop()?.toUpperCase()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setSelectedFileUrls((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate rounded-b-lg">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 relative bg-primary/10 py-2 px-3 rounded-[24px] overflow-hidden ">
            <AutoResizeTextarea
              {...register("prompt", { required: true })}
              placeholder="Nhập tin nhắn của bạn..."
              style={{ resize: "none" }}
              disabled={streamingState.isStreaming}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const promptValue = watch("prompt");
                  if (promptValue?.trim() && !streamingState.isStreaming) {
                    handleSubmit(onSubmit)();
                  }
                }
                // Shift+Enter sẽ cho phép xuống hàng (hành vi mặc định)
              }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChatUploadModal
                  onFileSelect={handleFileSelect}
                  onImageSelect={handleImageSelect}
                  disabled={streamingState.isStreaming}
                  maxFiles={5}
                  maxFileSize={10}
                />
                <SpeechToText
                  onTranscript={handleSpeechToText}
                  disabled={streamingState.isStreaming}
                />
              </div>
              {streamingState.isStreaming ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={cancelStream}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 [&_svg:not([class*='size-'])]:size-7 size-10"
                >
                  <X className="h-7 w-7" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size={"icon"}
                  variant="ghost"
                  className="text-blue-500 hover:text-blue-600 bg-white cursor-pointer border rounded-full [&_svg:not([class*='size-'])]:size-5 size-10"
                  disabled={!promptValue?.trim()}
                >
                  <ArrowUp className="h-7 w-7" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

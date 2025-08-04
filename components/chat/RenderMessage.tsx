"use client";

import { cn } from "@/lib/utils";
import { IMessage } from "@/model/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { Button } from "@/components/ui/button";
import {
  Copy,
  RotateCcw,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface RenderMessageProps {
  message: IMessage;
  onReplaceMessage?: (content: string) => void;
}

export const RenderMessage = ({
  message,
  onReplaceMessage,
}: RenderMessageProps) => {
  const isUser = message.role === "user";
  const [showActions, setShowActions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const handleCopy = async () => {
    try {
      // Trigger click animation
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 150);

      await navigator.clipboard.writeText(message.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleReplace = () => {
    if (onReplaceMessage) {
      onReplaceMessage(message.content);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFiles = () => {
    if (!message.files || message.files.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {message.files.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border"
          >
            {file.type === "image" ? (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <ImageIcon className="h-6 w-6 text-muted-foreground hidden" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  {file.size && (
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  {file.size && (
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </div>
              </div>
            )}
            <Link
              className="p-3 hover:bg-primary/20 rounded-lg transition-all duration-150"
              href={file.url}
              download={file.name}
            >
              <Download className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      key={message.id}
      className={`mb-8 max-w-5xl mx-auto group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex items-start gap-3 mb-2 w-full  ${
          isUser ? "flex-row-reverse justify-start" : "flex-row"
        }`}
      >
        <div className={`max-w-[100%]  ${!isUser && "w-full"} relative`}>
          <div
            className={`font-medium mb-1 flex items-center gap-2 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <span>
              {isUser ? "Bạn" : "DeepSeek AI"}
              <span className="text-xs text-muted-foreground ml-2 font-normal">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </span>
            {/* Action buttons for user messages */}
            {isUser && showActions && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0 hover:bg-primary/20 transition-all duration-150",
                    isClicking && "scale-90 bg-primary/30",
                    copySuccess && "bg-green-100 dark:bg-green-900/30"
                  )}
                  onClick={handleCopy}
                  title={copySuccess ? "Đã sao chép!" : "Sao chép"}
                >
                  <Copy
                    className={cn(
                      "h-3 w-3 transition-all duration-150",
                      copySuccess && "text-green-600 dark:text-green-400",
                      isClicking && "scale-75"
                    )}
                  />
                </Button>
                {onReplaceMessage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-primary/20"
                    onClick={handleReplace}
                    title="Thay thế vào ô chat"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div
            id="markdown-render"
            className={cn(
              `prose prose-sm dark:prose-invert w-full flex flex-col gap-5 ${
                isUser && "bg-primary/20 px-4 py-2 rounded-[24px]"
              }`
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, ...props }) => (
                  <CodeBlock {...props} children={props.children || ""} />
                ),
                a: ({ ...props }) => <a target="_blank" {...props} />,
                ul: ({ ...props }) => (
                  <ul
                    id="markdown-render-ul"
                    className="flex list-inside list-disc flex-col  gap-3"
                    {...props}
                  />
                ),

                ol: ({ ...props }) => {
                  return (
                    <ol
                      id="markdown-render-ol"
                      className=" list-inside list-decimal gap-0"
                      {...props}
                    ></ol>
                  );
                },

                li: ({ children, ...props }) => {
                  return (
                    <li
                      className=" list-inside marker:text-black/60 w-full  "
                      {...props}
                    >
                      {children}
                    </li>
                  );
                },
                h3: ({ children, ...props }) => (
                  <h3 className="whitespace-pre-wrap" {...props}>
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }) => (
                  <h4 className="whitespace-pre-wrap" {...props}>
                    {children}
                  </h4>
                ),
                h5: ({ children, ...props }) => (
                  <h5 className="whitespace-pre-wrap" {...props}>
                    {children}
                  </h5>
                ),
                h6: ({ children, ...props }) => (
                  <h6 className="whitespace-pre-wrap" {...props}>
                    {children}
                  </h6>
                ),

                table: ({ ...props }) => (
                  <div className="hide-scrollbar w-full overflow-x-scroll break-words">
                    <table className="w-full table-auto" {...props} />
                  </div>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
            {/* Render files and images */}
            {renderFiles()}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { cn } from "@/lib/utils";
import { IMessage } from "@/model/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw } from "lucide-react";
import { useState } from "react";

interface RenderMessageProps {
  message: IMessage;
  onReplaceMessage?: (content: string) => void;
}

export const RenderMessage = ({ message, onReplaceMessage }: RenderMessageProps) => {
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
      console.error('Failed to copy text: ', err);
    }
  };

  const handleReplace = () => {
    if (onReplaceMessage) {
      onReplaceMessage(message.content);
    }
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
        <div className={`max-w-[100%]  ${!isUser && 'w-full'} relative`}>
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
                   <Copy className={cn(
                     "h-3 w-3 transition-all duration-150",
                     copySuccess && "text-green-600 dark:text-green-400",
                     isClicking && "scale-75"
                   )} />
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
          </div>
        </div>
      </div>
    </div>
  );
};

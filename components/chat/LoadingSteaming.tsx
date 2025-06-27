import { BlockMatch } from "@llm-ui/react";
import { Loader2, MessageSquare } from "lucide-react";
import { MarkdownComponent } from "./MarkdownComponent";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const LoadingStreaming = ({
  blockMatches,
}: {
  blockMatches: BlockMatch[];
}) => {
  const [visible, setVisible] = useState(false);
  
  // Hiệu ứng fade-in khi component được mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-8 max-w-5xl mx-auto">
      <div className="flex items-start gap-3  mb-2 flex-row">
        <div className={cn(
          "w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300",
          "animate-pulse transition-all duration-700"
        )}>
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className={cn(
          "max-w-[100%] opacity-0 transform translate-y-2",
          visible && "opacity-100 translate-y-0 transition-all duration-500 ease-out"
        )}>
          <div className="font-medium mb-1 flex items-center text-left">
            DeepSeek AI
            <Loader2 className="ml-2 h-3 w-3 animate-spin" />
            <span className="text-xs text-muted-foreground ml-2 font-normal">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none typing-animation flex flex-col gap-5">
              {blockMatches.map((block, idx) => (
                <div key={idx} className="animate-fade-in">
                  <MarkdownComponent blockMatch={block} />
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

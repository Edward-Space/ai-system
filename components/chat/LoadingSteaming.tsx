import { BlockMatch } from "@llm-ui/react";
import { Loader2, MessageSquare } from "lucide-react";
import { MarkdownComponent } from "./MarkdownComponent";

export const LoadingStreaming = ({
  blockMatches,
}: {
  blockMatches: BlockMatch[];
}) => {
  return (
    <div className="mb-8 max-w-5xl mx-auto">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-medium mb-1 flex items-center">
            DeepSeek AI
            <Loader2 className="ml-2 h-3 w-3 animate-spin" />
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {blockMatches.map((block, idx) => (
              <div key={idx}>
                <MarkdownComponent blockMatch={block} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type LLMOutputComponent } from "@llm-ui/react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

// Customize this component with your own styling
export const MarkdownComponent: LLMOutputComponent = ({ blockMatch }) => {
  const markdown = blockMatch.output;
  // const [codeBlocks, setCodeBlocks] = useState<{ [key: string]: string }>({});
  const [visible, setVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // Hiệu ứng fade-in khi component được mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={componentRef}
      className={cn(
        "markdown-content",
        "opacity-0 transform translate-y-2",
        visible &&
          "opacity-100 translate-y-0 transition-all duration-500 ease-out"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ node, ...props }) => (
            <CodeBlock {...props} children={props.children || ""} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              id="markdown-render-ul"
              className="flex list-inside list-disc flex-col gap-3"
              {...props}
            />
          ),

          ol: ({ node, ...props }) => {
            return (
              <ol
                id="markdown-render-ol"
                className="list-inside list-decimal gap-0"
                {...props}
              ></ol>
            );
          },

          li: ({ node, children, ...props }) => {
            return (
              <li className="list-inside marker:text-secondary" {...props}>
                {children}
              </li>
            );
          },

          h3: ({ node, children, ...props }) => (
            <h3 className="whitespace-pre-wrap" {...props}>
              {children}
            </h3>
          ),
          h4: ({ node, children, ...props }) => (
            <h4 className="whitespace-pre-wrap" {...props}>
              {children}
            </h4>
          ),
          h5: ({ node, children, ...props }) => (
            <h5 className="whitespace-pre-wrap" {...props}>
              {children}
            </h5>
          ),
          h6: ({ node, children, ...props }) => (
            <h6 className="whitespace-pre-wrap" {...props}>
              {children}
            </h6>
          ),

          table: ({ node, ...props }) => (
            <div className="hide-scrollbar w-full overflow-x-scroll break-words">
              <table className="w-full table-auto" {...props} />
            </div>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

// Thêm CSS này vào global CSS hoặc component styles
// Có thể thêm vào file CSS riêng và import
/*
@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}

// Hoặc sử dụng class-based dark mode
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
*/

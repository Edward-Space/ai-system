"use client";

import { cn } from "@/lib/utils";
import { IMessage } from "@/model/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

export const RenderMessage = ({ message }: { message: IMessage }) => {
  const isUser = message.role === "user";

  return (
    <div key={message.id} className={`mb-8 max-w-5xl mx-auto`}>
      <div
        className={`flex items-start gap-3 mb-2 w-full  ${
          isUser ? "flex-row-reverse justify-start" : "flex-row"
        }`}
      >
        <div className={`max-w-[100%]  ${!isUser && 'w-full'}`}>
          <div
            className={`font-medium mb-1 ${
              isUser ? "text-right"  : "text-left "
            }`}
          >
            {isUser ? "Bạn" : "DeepSeek AI"}
            <span className="text-xs text-muted-foreground ml-2 font-normal">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div
            id="markdown-render"
            className={cn(
              `prose prose-sm dark:prose-invert max-w-none flex flex-col gap-5 ${
                isUser && "bg-primary/20 p-4 rounded-[24px]"
              }`
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // code: ({ className, children, ...props }) => {
                //   const match = /language-(\w+)/.exec(className || "");
                //   const lang = match ? match[1] : "";
                //   const codeContent = String(children).replace(/\n$/, "");
                //   const [highlightedCode, setHighlightedCode] =
                //     useState<string>("");

                //   useEffect(() => {
                //     let isMounted = true;

                //     if (lang) {
                //       codeToHtml(codeContent, {
                //         lang,
                //         themes: {
                //           light: "tokyo-night",
                //           dark: "github-dark",
                //         },
                //         defaultColor: "light",
                //       })
                //         .then((html) => {
                //           if (isMounted) {
                //             setHighlightedCode(html);
                //           }
                //         })
                //         .catch((err) => {
                //           console.error("Error highlighting code:", err);
                //         });
                //     }

                //     return () => {
                //       isMounted = false;
                //     };
                //   }, [lang, codeContent]);

                //   if (lang) {
                //     // Sử dụng dangerouslySetInnerHTML để hiển thị HTML được tạo bởi Shiki
                //     return (
                //       <div className="shiki-wrapper w-full  my-4">
                //         <div className="code-header flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-md">
                //           <span className="text-xs font-mono">{lang}</span>
                //           <button
                //             className="copy-button text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                //             onClick={() =>
                //               navigator.clipboard.writeText(codeContent)
                //             }
                //           >
                //             Copy
                //           </button>
                //         </div>
                //         <div
                //           className="code-block-container bg-black w-full overflow-x-scroll markdown-code "
                //           dangerouslySetInnerHTML={{
                //             __html:
                //               highlightedCode ||
                //               `<pre class="language-${lang} "><code>${codeContent}</code></pre>`,
                //           }}
                //         />
                //       </div>
                //     );
                //   }

                //   return (
                //     <code className={className} {...props}>
                //       {children}
                //     </code>
                //   );
                // },
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
                      className=" list-inside list-decimal   gap-0"
                      {...props}
                    ></ol>
                  );
                },

                li: ({ children, ...props }) => {
                  return (
                    <li
                      className=" list-inside   marker:text-secondary  "
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

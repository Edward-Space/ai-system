import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type LLMOutputComponent } from "@llm-ui/react";
import { codeToHtml } from "shiki";
import { useState, useEffect } from "react";

// Customize this component with your own styling
export const MarkdownComponent: LLMOutputComponent = ({ blockMatch }) => {
  const markdown = blockMatch.output;
  const [codeBlocks, setCodeBlocks] = useState<{[key: string]: string}>({});
  
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const lang = match ? match[1] : '';
          const codeContent = String(children).replace(/\n$/, '');
          const codeKey = `${lang}-${codeContent.substring(0, 20)}`;
          
          useEffect(() => {
            if (lang) {
              // Xử lý Promise từ codeToHtml
              codeToHtml(codeContent, {
                lang,
                themes: {
                  light: 'github-light',
                  dark: 'github-dark'
                },
                defaultColor: 'light'
              }).then(html => {
                setCodeBlocks(prev => ({
                  ...prev,
                  [codeKey]: html
                }));
              }).catch(err => {
                console.error('Error highlighting code:', err);
              });
            }
          }, [lang, codeContent, codeKey]);
          
          if (lang) {
            // Hiển thị code block với header và nội dung đã highlight (nếu có)
            return (
              <div className="shiki-wrapper my-4">
                <div className="code-header flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-md">
                  <span className="text-xs font-mono">{lang}</span>
                  <button 
                    className="copy-button text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => navigator.clipboard.writeText(codeContent)}
                  >
                    Copy
                  </button>
                </div>
                <div 
                  className="code-block-container"
                  dangerouslySetInnerHTML={{
                    __html: codeBlocks[codeKey] || `<pre class="language-${lang}"><code>${codeContent}</code></pre>`
                  }}
                />
              </div>
            );
          }
          
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {markdown}
    </ReactMarkdown>
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
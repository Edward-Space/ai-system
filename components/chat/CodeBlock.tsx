import React, { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

// Import common languages
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';

// Register languages
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('xml', markup);
SyntaxHighlighter.registerLanguage('html', markup);

type CodeBlockProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
};
export const CodeBlock: React.FC<CodeBlockProps> = ({
  node,
  inline,
  className,
  children,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  if (inline) {
    return (
      <code {...props} className={`rounded-xl bg-gray-200 px-2 py-1 text-sm ${className}`}>
        {children}
      </code>
    );
  }
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'plaintext';
  
  // Phân loại ngôn ngữ
  const getLanguageType = (lang: string) => {
    const jsFamily = ['javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx'];
    const webFamily = ['html', 'css', 'scss', 'sass', 'less'];
    const backendFamily = ['python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust'];
    const dataFamily = ['json', 'xml', 'yaml', 'sql'];
    const shellFamily = ['bash', 'shell', 'powershell', 'cmd'];
    
    if (jsFamily.includes(lang.toLowerCase())) return 'javascript';
    if (webFamily.includes(lang.toLowerCase())) return 'web';
    if (backendFamily.includes(lang.toLowerCase())) return 'backend';
    if (dataFamily.includes(lang.toLowerCase())) return 'data';
    if (shellFamily.includes(lang.toLowerCase())) return 'shell';
    return 'bash';
  };
  
  const languageType = getLanguageType(language);
  
  return (
    <div className='group relative my-2 w-full max-w-[100%] overflow-hidden rounded-md'>
      {/* Header với thông tin ngôn ngữ */}
      <div className={`h-[50px] w-full flex items-center justify-between px-4 bg-primary/40`}>
        <div className="flex items-center gap-2">
       
          <span className="text-xs  capitalize">{languageType}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className='flex items-center gap-1 rounded-md bg-black/10 hover:bg-black/20 p-1 px-2 py-1 text-xs transition-colors duration-200'
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={coldarkCold}
        customStyle={{
          borderBottom: '6px',
          fontSize: '16px',
          fontWeight: '500',
          overflowY: 'auto',
          lineHeight: '1.6',
          margin:0,
          backgroundColor: '#A6D3FF4D',
        }}
        language={language}
        PreTag='div'
        wrapLongLines={true}
        
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

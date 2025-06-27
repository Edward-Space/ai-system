import React, { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

// Import some common languages
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

// Register languages
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);

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
  const customStyle = {
    lineHeight: '1.5',
    fontSize: '1rem',
    borderRadius: '5px',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  };
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'plaintext';
  return (
    <div className='group relative my-2 w-full max-w-[100%] overflow-hidden rounded-md'>
      <button
        onClick={copyToClipboard}
        className='absolute right-2 top-2 flex items-center gap-1 rounded-md bg-primary/50 p-1 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter
        style={coldarkCold}
        customStyle={{
          borderRadius: '12px',
          // padding: '1rem',
          fontSize: '16px',
          // maxHeight: '400px',
          fontWeight: '500',
          overflowY: 'auto',
          lineHeight: '1.6',
        //   backgroundColor: '#57b19c33',
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

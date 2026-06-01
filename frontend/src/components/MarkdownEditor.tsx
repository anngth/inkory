'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex border-b bg-gray-50">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'write'
              ? 'bg-white border-b-2 border-black'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'preview'
              ? 'bg-white border-b-2 border-black'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          Preview
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'write' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[400px] p-4 focus:outline-none resize-none font-mono text-sm"
          />
        ) : (
          <div className="prose prose-lg max-w-none p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {value || '*No content to preview*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

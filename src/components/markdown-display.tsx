
// src/components/markdown-display.tsx
"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

export function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  if (!content) {
    return null;
  }

  // `react-markdown` allows HTML by default if `remark-gfm` is used or if it's basic HTML.
  // For security, if you were taking user-generated markdown that might contain malicious HTML,
  // you would need to sanitize it or use `rehype-sanitize`.
  // For this app's help guide, where markdown is developer-controlled, it's generally safe.
  return (
    <div 
      className={cn(
        "prose prose-sm sm:prose-base dark:prose-invert max-w-none", 
        "prose-headings:font-headline prose-headings:text-primary", 
        "prose-a:text-primary hover:prose-a:underline", 
        "prose-code:bg-muted/30 prose-code:text-accent-foreground prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-code prose-code:before:content-[''] prose-code:after:content-['']", 
        "prose-pre:bg-muted/50 prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto prose-pre:font-code", 
        "prose-blockquote:border-primary prose-blockquote:text-muted-foreground", 
        "prose-ul:list-disc prose-ol:list-decimal", 
        "prose-table:border prose-table:rounded-md prose-th:bg-muted/50", 
        "prose-img:rounded-md prose-img:border prose-img:shadow-sm prose-img:max-w-full prose-img:mx-auto", // Styles for images
        "break-words", 
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

    
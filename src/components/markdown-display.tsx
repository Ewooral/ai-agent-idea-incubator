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

  return (
    <div 
      className={cn(
        "prose prose-sm sm:prose-base dark:prose-invert max-w-none", // Base prose styles + dark mode + responsive font size
        "prose-headings:font-headline prose-headings:text-primary", // Custom heading styles
        "prose-a:text-primary hover:prose-a:underline", // Custom link styles
        "prose-code:bg-muted/30 prose-code:text-accent-foreground prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-code prose-code:before:content-[''] prose-code:after:content-['']", // Custom inline code styles
        "prose-pre:bg-muted/50 prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto prose-pre:font-code", // Custom code block styles
        "prose-blockquote:border-primary prose-blockquote:text-muted-foreground", // Custom blockquote styles
        "prose-ul:list-disc prose-ol:list-decimal", // List styles
        "prose-table:border prose-table:rounded-md prose-th:bg-muted/50", // Table styles
        "break-words", // Ensure long words break
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

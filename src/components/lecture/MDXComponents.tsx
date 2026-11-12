import React from 'react';
import { TopicSection } from './TopicSection';
import { KeyIdea } from './KeyIdeaCallout';
import { AddedByTutor } from './TutorCallout';
import { CheckBadge } from './CheckBadge';
import { Collapsible } from './Collapsible';
import { CodeBlock } from './CodeBlock';

export const mdxComponents = {
  TopicSection,
  KeyIdea,
  AddedByTutor,
  CheckBadge,
  Collapsible,
  CodeBlock,
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-xs sm:text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-zinc-100 dark:bg-zinc-800/70 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="py-2.5 px-4 font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-300" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="py-3 px-4 border-b border-zinc-100 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300" {...props}>
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-4 pl-4 border-l-2 border-zinc-300 dark:border-zinc-700 italic text-zinc-600 dark:text-zinc-400" {...props}>
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-5 p-4 rounded-xl bg-zinc-950 text-zinc-100 text-xs sm:text-sm font-mono overflow-x-auto border border-zinc-800 shadow-md leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-xs sm:text-[13px] font-mono font-medium border border-zinc-200 dark:border-zinc-700/60"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={`${className || ''} font-mono`} {...props}>
        {children}
      </code>
    );
  },
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure className="my-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || 'Lecture illustration'}
        className="mx-auto rounded-xl border border-zinc-200 dark:border-zinc-800 max-w-full h-auto shadow-sm"
        {...props}
      />
      {alt && (
        <figcaption className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
};


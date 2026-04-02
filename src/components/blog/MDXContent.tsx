'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import CodeBlock from './CodeBlock';

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

const components = {
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // Extract language from child code element
    const childElement = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
    const className = childElement?.props?.className ?? '';
    const codeChildren = childElement?.props?.children;

    return (
      <CodeBlock className={className} {...props}>
        {codeChildren}
      </CodeBlock>
    );
  },
  code: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    // Inline code (not inside pre)
    if (!className) {
      return (
        <code
          className="font-mono text-sm bg-slate-100 dark:bg-gray-800 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-gray-700/50"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  h2: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={id}
      className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 scroll-mt-24 group"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={id}
      className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3 scroll-mt-24 group"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="text-slate-600 dark:text-gray-300 my-4 space-y-1.5 list-disc list-inside" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="text-slate-600 dark:text-gray-300 my-4 space-y-1.5 list-decimal list-inside" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-slate-600 dark:text-gray-300 leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-green-500 bg-slate-100/50 dark:bg-green-500/5 pl-4 py-2 pr-2 my-6 italic text-slate-700 dark:text-gray-400"
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline underline-offset-2 transition-colors duration-150 font-medium"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-gray-700/50 shadow-sm">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-slate-50 dark:bg-gray-800/50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="text-left text-slate-900 dark:text-gray-200 font-semibold px-4 py-3 border-b border-slate-200 dark:border-gray-700/50"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="text-slate-600 dark:text-gray-300 px-4 py-3 border-b border-slate-100 dark:border-gray-800/50"
      {...props}
    >
      {children}
    </td>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="border-slate-200 dark:border-gray-800 my-8" {...props} />
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-slate-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),
};

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={components} />
    </div>
  );
}

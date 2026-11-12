import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 ${className}`}>
      <Link
        href="/"
        className="flex items-center hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        title="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 flex-shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors truncate max-w-[150px] sm:max-w-xs"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`truncate max-w-[200px] sm:max-w-md ${isLast ? 'font-medium text-zinc-800 dark:text-zinc-200' : ''}`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}


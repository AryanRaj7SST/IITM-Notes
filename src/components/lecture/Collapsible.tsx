'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Collapsible({ title, defaultOpen = true, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors flex items-center justify-between text-left"
      >
        <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 mr-2 text-zinc-500" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2 text-zinc-500" />
          )}
          {title}
        </span>
        <span className="text-[11px] font-mono text-zinc-400">
          {isOpen ? 'Click to collapse' : 'Click to expand'}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800/80 animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </div>
  );
}


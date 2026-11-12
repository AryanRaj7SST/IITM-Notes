'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface CheckBadgeProps {
  reason: string;
}

export function CheckBadge({ reason }: CheckBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block my-1 align-middle">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
        title="Speech-to-text transcript correction"
      >
        <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
        <span>check: transcription note</span>
      </button>

      {isOpen && (
        <span
          className="absolute z-30 bottom-full left-0 mb-1.5 w-64 sm:w-80 p-2.5 bg-zinc-900 dark:bg-zinc-800 text-zinc-100 text-xs rounded-lg shadow-xl border border-zinc-700 block animate-in fade-in zoom-in-95 duration-100"
          onClick={() => setIsOpen(false)}
        >
          <strong className="block text-amber-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
            Speech-to-Text Correction:
          </strong>
          {reason}
          <span className="block text-[10px] text-zinc-400 mt-1 italic">Click badge to dismiss</span>
        </span>
      )}
    </span>
  );
}


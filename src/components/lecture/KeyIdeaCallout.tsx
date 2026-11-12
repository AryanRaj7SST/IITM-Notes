import React from 'react';
import { Lightbulb } from 'lucide-react';

interface KeyIdeaProps {
  children: React.ReactNode;
}

export function KeyIdea({ children }: KeyIdeaProps) {
  return (
    <div className="my-4 p-4 rounded-xl border border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/15 text-zinc-800 dark:text-zinc-200">
      <div className="flex items-start space-x-3">
        <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm font-medium leading-relaxed">
          <span className="font-bold text-amber-700 dark:text-amber-400 mr-1.5 uppercase text-[11px] tracking-wider">
            Key Idea:
          </span>
          {children}
        </div>
      </div>
    </div>
  );
}


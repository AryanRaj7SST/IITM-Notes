import React from 'react';
import { UserCheck } from 'lucide-react';

interface AddedByTutorProps {
  children: React.ReactNode;
}

export function AddedByTutor({ children }: AddedByTutorProps) {
  return (
    <div className="my-5 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center space-x-2 mb-2">
        <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <UserCheck className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
          Added by tutor
        </span>
      </div>
      <div className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </div>
  );
}


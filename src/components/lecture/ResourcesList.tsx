import React from 'react';
import { ResourceLink } from '@/types';
import { ExternalLink, CheckCircle2, BookOpen } from 'lucide-react';

interface ResourcesListProps {
  resources: ResourceLink[];
}

export function ResourcesList({ resources }: ResourcesListProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        No external resources listed for this lecture.
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-zinc-500" />
          Curated Free & Official Resources
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Verified academic course portals, open textbooks, and official documentation matching this lecture.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {resources.map((res, idx) => (
          <a
            key={idx}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {res.type}
                </span>
                {res.verified && (
                  <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Link
                  </span>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors flex-shrink-0" />
            </div>

            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:underline decoration-zinc-400 underline-offset-4 mb-2">
              {res.title}
            </h4>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {res.description}
            </p>

            <div className="mt-3 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 truncate">
              {res.url}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}


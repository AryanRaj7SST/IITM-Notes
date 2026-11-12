import React from 'react';
import { LectureFrontmatter } from '@/types';
import { BookOpen, HelpCircle, ExternalLink, Hash, Clock, CheckCircle } from 'lucide-react';

interface OverviewTabProps {
  meta: LectureFrontmatter;
  onJumpToTopic: (topicId: string) => void;
}

export function OverviewTab({ meta, onJumpToTopic }: OverviewTabProps) {
  const accentBadge = {
    mlt: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    mad2: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    bdm: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20',
  }[meta.subject];

  return (
    <div className="space-y-6 my-6">
      {/* Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${accentBadge}`}>
            Lecture Overview
          </span>
          {meta.duration && (
            <span className="flex items-center text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {meta.duration}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {meta.title}
        </h3>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {meta.overviewSummary ||
            'This lecture covers fundamental theoretical derivations, architectural principles, and real-world applied patterns for IIT Madras BS Degree curriculum.'}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <span className="text-[11px] font-mono text-zinc-400 uppercase block">Topics</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {meta.topics.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <span className="text-[11px] font-mono text-zinc-400 uppercase block">Self-Test</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {meta.selfTest?.length || 0} Questions
            </span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <span className="text-[11px] font-mono text-zinc-400 uppercase block">Formulas / Code</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {meta.formulas?.length || meta.codeSnippets?.length || 0} Artifacts
            </span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <span className="text-[11px] font-mono text-zinc-400 uppercase block">Resources</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {meta.resources?.length || 0} Verified
            </span>
          </div>
        </div>
      </div>

      {/* Topics Breakdown */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center">
          <Hash className="w-4 h-4 mr-1 text-zinc-400" />
          Topics Covered in this Lecture
        </h4>

        <div className="space-y-3">
          {meta.topics.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => onJumpToTopic(t.id)}
              className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 cursor-pointer transition-colors group flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-semibold text-zinc-400">
                    Topic {idx + 1}
                  </span>
                  <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white">
                    {t.title.replace(/^[0-9.]+\s*/, '')}
                  </h5>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {t.keyIdea}
                </p>
              </div>

              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 flex items-center flex-shrink-0 mt-1">
                Read notes &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


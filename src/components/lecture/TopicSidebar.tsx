'use client';

import React, { useEffect, useState } from 'react';
import { Topic, SubjectId } from '@/types';
import { Check, Hash, ArrowUp, ArrowDown } from 'lucide-react';
import { isTopicCompleted, setTopicCompleted, useProgressNotifier } from '@/lib/storage';

interface TopicSidebarProps {
  topics: Topic[];
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  subject: SubjectId;
  week: number;
  lecture: number;
}

export function TopicSidebar({
  topics,
  activeTopicId,
  onSelectTopic,
  subject,
  week,
  lecture,
}: TopicSidebarProps) {
  const progressTick = useProgressNotifier();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    const current = isTopicCompleted(subject, week, lecture, topicId);
    setTopicCompleted(subject, week, lecture, topicId, !current);
  };

  const accentText = {
    mlt: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    mad2: 'text-sky-600 dark:text-sky-400 font-semibold',
    bdm: 'text-violet-600 dark:text-violet-400 font-semibold',
  }[subject];

  const accentActiveBorder = {
    mlt: 'border-l-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
    mad2: 'border-l-2 border-sky-500 bg-sky-50/40 dark:bg-sky-950/20',
    bdm: 'border-l-2 border-violet-500 bg-violet-50/40 dark:bg-violet-950/20',
  }[subject];

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="sticky top-20 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center">
            <Hash className="w-3.5 h-3.5 mr-1" />
            Lecture Topics
          </h4>
          <span className="text-[11px] font-mono text-zinc-400">
            {topics.length} sections
          </span>
        </div>

        <nav className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {topics.map((topic, idx) => {
            const isActive = activeTopicId === topic.id;
            const completed = mounted && isTopicCompleted(subject, week, lecture, topic.id);

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`group flex items-start justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? `${accentActiveBorder} text-zinc-900 dark:text-zinc-100`
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-start space-x-2 mr-2">
                  <span className="text-[11px] font-mono text-zinc-400 mt-0.5 flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span className={`text-xs leading-snug line-clamp-2 ${isActive ? accentText : ''}`}>
                    {topic.title.replace(/^[0-9.]+\s*/, '')}
                  </span>
                </div>

                {/* Mark as done checkbox */}
                <button
                  type="button"
                  onClick={(e) => handleToggle(e, topic.id)}
                  aria-label={`Mark topic ${idx + 1} as done`}
                  title={completed ? 'Completed' : 'Mark as done'}
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    completed
                      ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                      : 'border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                  }`}
                >
                  {completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Keyboard Hints */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Next/Prev topic:</span>
            <div className="flex space-x-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded font-mono text-[10px]">
                ↓
              </kbd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Search all notes:</span>
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded font-mono text-[10px]">
              /
            </kbd>
          </div>
        </div>
      </div>
    </aside>
  );
}


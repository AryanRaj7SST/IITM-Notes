'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { isTopicCompleted, setTopicCompleted, useProgressNotifier } from '@/lib/storage';
import { SubjectId } from '@/types';

interface TopicSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function TopicSection({ id, title, children }: TopicSectionProps) {
  const params = useParams();
  const subject = (params?.subject as SubjectId) || 'mlt';
  const weekNum =
    typeof params?.week === 'string'
      ? parseInt(params.week.replace('week-', ''), 10)
      : 1;
  const lectureNum =
    typeof params?.lecture === 'string'
      ? parseInt(params.lecture.replace('lecture-', ''), 10)
      : 1;

  const progressTick = useProgressNotifier();
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompleted(isTopicCompleted(subject, weekNum, lectureNum, id));
  }, [subject, weekNum, lectureNum, id, progressTick]);

  const toggleDone = () => {
    const next = !completed;
    setTopicCompleted(subject, weekNum, lectureNum, id, next);
    setCompleted(next);
  };

  return (
    <section
      id={id}
      className="scroll-mt-24 pt-6 pb-8 border-b border-zinc-200/80 dark:border-zinc-800/80 last:border-b-0"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
          {title}
        </h2>

        {mounted && (
          <button
            type="button"
            onClick={toggleDone}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 border ${
              completed
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            title={completed ? 'Marked as completed' : 'Mark as done'}
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                completed ? 'bg-emerald-500 text-white' : 'border border-zinc-400'
              }`}
            >
              {completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>{completed ? 'Completed' : 'Mark done'}</span>
          </button>
        )}
      </div>

      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Topic, SubjectId } from '@/types';
import { isTopicCompleted, useProgressNotifier } from '@/lib/storage';

interface LectureCardProps {
  subject: SubjectId;
  week: number;
  lecture: number;
  title: string;
  duration?: string;
  topics: Topic[];
}

export function LectureCard({
  subject,
  week,
  lecture,
  title,
  duration,
  topics,
}: LectureCardProps) {
  const progressTick = useProgressNotifier();
  const [completedCount, setCompletedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let done = 0;
    topics.forEach((t) => {
      if (isTopicCompleted(subject, week, lecture, t.id)) {
        done++;
      }
    });
    setCompletedCount(done);
  }, [subject, week, lecture, topics, progressTick]);

  const isCompleted = topics.length > 0 && completedCount === topics.length;
  const isInProgress = completedCount > 0 && !isCompleted;

  const accentColorHover = {
    mlt: 'hover:border-emerald-500/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    mad2: 'hover:border-sky-500/50 group-hover:text-sky-600 dark:group-hover:text-sky-400',
    bdm: 'hover:border-violet-500/50 group-hover:text-violet-600 dark:group-hover:text-violet-400',
  }[subject];

  return (
    <Link
      href={`/${subject}/week-${week}/lecture-${lecture}`}
      className={`group block p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 hover:shadow-md ${accentColorHover}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            L{lecture}
          </span>
          {duration && (
            <span className="flex items-center text-xs text-zinc-400">
              <Clock className="w-3 h-3 mr-1" />
              {duration}
            </span>
          )}
        </div>

        <div>
          {mounted && (
            <>
              {isCompleted ? (
                <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                </span>
              ) : isInProgress ? (
                <span className="inline-flex items-center text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Circle className="w-3 h-3 mr-1 fill-amber-500" /> {completedCount}/{topics.length}
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {topics.length} Topics
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
        {title}
      </h3>

      {/* Topics Chip List */}
      <div className="space-y-1.5 mb-4">
        {topics.map((t) => (
          <div key={t.id} className="flex items-start text-xs text-zinc-500 dark:text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mt-1.5 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{t.title}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
        <span>Open Interactive Lecture</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}


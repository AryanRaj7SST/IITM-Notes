'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { WeekSummary, SubjectId } from '@/types';
import { ProgressBar } from '@/components/common/ProgressBar';
import { isTopicCompleted, useProgressNotifier } from '@/lib/storage';

interface WeekCardProps {
  week: WeekSummary;
  subject: SubjectId;
}

export function WeekCard({ week, subject }: WeekCardProps) {
  const progressTick = useProgressNotifier();
  const [completedCount, setCompletedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let done = 0;
    week.lectures.forEach((l) => {
      l.topics.forEach((t) => {
        if (isTopicCompleted(subject, week.week, l.lecture, t.id)) {
          done++;
        }
      });
    });
    setCompletedCount(done);
  }, [week, subject, progressTick]);

  const percentage = week.totalTopics > 0 ? (completedCount / week.totalTopics) * 100 : 0;

  const accentColorKey = {
    mlt: 'emerald' as const,
    mad2: 'sky' as const,
    bdm: 'violet' as const,
  }[subject];

  // Collect unique topic titles
  const allTopicChips = week.lectures.flatMap((l) => l.topics);

  return (
    <Link
      href={`/${subject}/week-${week.week}`}
      className="group block p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Module {week.week}
          </span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors">
            {week.title}
          </h3>
        </div>
        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      <div className="flex items-center space-x-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
        <span className="flex items-center">
          <BookOpen className="w-3.5 h-3.5 mr-1 text-zinc-400" />
          {week.lectures.length} {week.lectures.length === 1 ? 'Lecture' : 'Lectures'}
        </span>
        <span className="flex items-center">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-zinc-400" />
          {mounted ? `${completedCount}/${week.totalTopics} Topics` : `${week.totalTopics} Topics`}
        </span>
      </div>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {allTopicChips.slice(0, 4).map((t, idx) => (
          <span
            key={idx}
            className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50 line-clamp-1 max-w-[200px]"
          >
            {t.title.replace(/^[0-9.]+\s*/, '')}
          </span>
        ))}
        {allTopicChips.length > 4 && (
          <span className="text-[11px] px-1.5 py-0.5 text-zinc-400">
            +{allTopicChips.length - 4} more
          </span>
        )}
      </div>

      <ProgressBar
        progress={mounted ? percentage : 0}
        accentColor={accentColorKey}
        showLabel={true}
        size="sm"
      />
    </Link>
  );
}


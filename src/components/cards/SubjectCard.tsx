'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { SubjectSummary } from '@/types';
import { ProgressBar } from '@/components/common/ProgressBar';
import { isTopicCompleted, useProgressNotifier } from '@/lib/storage';

interface SubjectCardProps {
  summary: SubjectSummary;
}

export function SubjectCard({ summary }: SubjectCardProps) {
  const { meta, weeks, totalLectures, totalTopics } = summary;
  const progressTick = useProgressNotifier();
  const [completedCount, setCompletedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let done = 0;
    weeks.forEach((w) => {
      w.lectures.forEach((l) => {
        l.topics.forEach((t) => {
          if (isTopicCompleted(meta.id, w.week, l.lecture, t.id)) {
            done++;
          }
        });
      });
    });
    setCompletedCount(done);
  }, [summary, progressTick, meta.id, weeks]);

  const percentage = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  const accentBorderHover = {
    mlt: 'hover:border-emerald-500/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    mad2: 'hover:border-sky-500/50 group-hover:text-sky-600 dark:group-hover:text-sky-400',
    bdm: 'hover:border-violet-500/50 group-hover:text-violet-600 dark:group-hover:text-violet-400',
  }[meta.id];

  const accentColorKey = {
    mlt: 'emerald' as const,
    mad2: 'sky' as const,
    bdm: 'violet' as const,
  }[meta.id];

  return (
    <Link
      href={`/${meta.id}`}
      className={`group block p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 hover:shadow-lg ${accentBorderHover}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider mb-2 ${meta.accent.badge}`}>
            {meta.code}
          </span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
            {meta.name}
          </h3>
        </div>
        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 line-clamp-2">
        {meta.description}
      </p>

      {/* Meta Stats */}
      <div className="flex items-center space-x-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <span className="flex items-center">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
          {weeks.length} {weeks.length === 1 ? 'Week' : 'Weeks'}
        </span>
        <span className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
          {totalLectures} {totalLectures === 1 ? 'Lecture' : 'Lectures'}
        </span>
        <span className="flex items-center">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
          {mounted ? `${completedCount}/${totalTopics} Done` : `${totalTopics} Topics`}
        </span>
      </div>

      {/* Progress */}
      <ProgressBar
        progress={mounted ? percentage : 0}
        accentColor={accentColorKey}
        showLabel={true}
        size="sm"
      />
    </Link>
  );
}


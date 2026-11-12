import React from 'react';
import { notFound } from 'next/navigation';
import { getAllSubjectSlugs, getSubjectSummary } from '@/lib/content';
import { SubjectId } from '@/types';
import { WeekCard } from '@/components/cards/WeekCard';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { BookOpen, Layers } from 'lucide-react';

export function generateStaticParams() {
  return getAllSubjectSlugs();
}

interface SubjectPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const resolvedParams = await params;
  const { subject } = resolvedParams;

  if (!['mlt', 'mad2', 'bdm'].includes(subject)) {
    notFound();
  }

  const summary = getSubjectSummary(subject as SubjectId);
  const { meta, weeks, totalLectures } = summary;

  const breadcrumbs = [
    { label: meta.code },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${meta.accent.badge}`}>
                {meta.code}
              </span>
              <span className="text-xs text-zinc-400">IIT Madras BS Degree</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {meta.name}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              {meta.description}
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto flex-shrink-0">
            <div className="text-center px-2">
              <span className="block text-lg font-bold text-zinc-900 dark:text-zinc-100">{weeks.length}</span>
              <span>Weeks</span>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-center px-2">
              <span className="block text-lg font-bold text-zinc-900 dark:text-zinc-100">{totalLectures}</span>
              <span>Lectures</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-zinc-500" />
            Course Modules & Weekly Transcripts
          </h2>
          <span className="text-xs text-zinc-400">
            Select a week to view individual lectures
          </span>
        </div>

        {weeks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeks.map((week) => (
              <WeekCard key={week.week} week={week} subject={meta.id} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-sm">
            No weeks added yet for this subject.
          </div>
        )}
      </div>
    </div>
  );
}


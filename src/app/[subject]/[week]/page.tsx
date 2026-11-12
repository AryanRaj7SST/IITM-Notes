import React from 'react';
import { notFound } from 'next/navigation';
import { getAllWeekSlugs, getWeekData } from '@/lib/content';
import { SUBJECTS } from '@/lib/subjects';
import { SubjectId } from '@/types';
import { LectureCard } from '@/components/cards/LectureCard';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { BookOpen, ListOrdered } from 'lucide-react';

export function generateStaticParams() {
  return getAllWeekSlugs();
}

interface WeekPageProps {
  params: Promise<{
    subject: string;
    week: string;
  }>;
}

export default async function WeekPage({ params }: WeekPageProps) {
  const resolvedParams = await params;
  const { subject, week } = resolvedParams;

  if (!['mlt', 'mad2', 'bdm'].includes(subject)) {
    notFound();
  }

  const subjectMeta = SUBJECTS[subject as SubjectId];
  const weekData = getWeekData(subject, week);

  if (!weekData) {
    notFound();
  }

  const breadcrumbs = [
    { label: subjectMeta.code, href: `/${subject}` },
    { label: `Week ${weekData.week}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${subjectMeta.accent.badge}`}>
                {subjectMeta.code}
              </span>
              <span className="text-xs text-zinc-400">
                Module {weekData.week}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Week {weekData.week} Lectures & Notes
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Explore individual lecture notes, step-by-step proofs, code walkthroughs, and self-tests.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto flex-shrink-0">
            <div className="text-center px-2">
              <span className="block text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {weekData.lectures.length}
              </span>
              <span>Lectures</span>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-center px-2">
              <span className="block text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {weekData.totalTopics}
              </span>
              <span>Topics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center">
            <ListOrdered className="w-5 h-5 mr-2 text-zinc-500" />
            Lectures in Week {weekData.week}
          </h2>
          <span className="text-xs text-zinc-400">
            Click any lecture to open interactive notes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weekData.lectures.map((lec) => (
            <LectureCard
              key={lec.lecture}
              subject={subjectMeta.id}
              week={weekData.week}
              lecture={lec.lecture}
              title={lec.title}
              duration={lec.duration}
              topics={lec.topics}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


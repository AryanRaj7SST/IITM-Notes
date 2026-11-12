'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LectureFrontmatter, SubjectId } from '@/types';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { TopicSidebar } from './TopicSidebar';
import { LectureTabs, LectureTabKey } from './LectureTabs';
import { OverviewTab } from './OverviewTab';
import { FormulasTab } from './FormulasTab';
import { CodeTab } from './CodeTab';
import { SelfTest } from './SelfTest';
import { ResourcesList } from './ResourcesList';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { isTopicCompleted, setTopicCompleted, useProgressNotifier } from '@/lib/storage';

interface LectureClientViewProps {
  meta: LectureFrontmatter;
  contentChildren: React.ReactNode;
  prevLecture: { url: string; title: string } | null;
  nextLecture: { url: string; title: string } | null;
}

export function LectureClientView({
  meta,
  contentChildren,
  prevLecture,
  nextLecture,
}: LectureClientViewProps) {
  const [activeTab, setActiveTab] = useState<LectureTabKey>('notes');
  const [activeTopicId, setActiveTopicId] = useState<string>(
    meta.topics[0]?.id || ''
  );
  const progressTick = useProgressNotifier();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation for topics (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = meta.topics.findIndex((t) => t.id === activeTopicId);
        if (currentIndex < meta.topics.length - 1) {
          const nextTopic = meta.topics[currentIndex + 1];
          setActiveTopicId(nextTopic.id);
          setActiveTab('notes');
          const el = document.getElementById(nextTopic.id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = meta.topics.findIndex((t) => t.id === activeTopicId);
        if (currentIndex > 0) {
          const prevTopic = meta.topics[currentIndex - 1];
          setActiveTopicId(prevTopic.id);
          setActiveTab('notes');
          const el = document.getElementById(prevTopic.id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [meta.topics, activeTopicId]);

  // Scrollspy observer for active topic
  useEffect(() => {
    if (activeTab !== 'notes') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTopicId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    meta.topics.forEach((topic) => {
      const el = document.getElementById(topic.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [meta.topics, activeTab]);

  const handleSelectTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setActiveTab('notes');
    const el = document.getElementById(topicId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const completedTopicsCount = mounted
    ? meta.topics.filter((t) =>
        isTopicCompleted(meta.subject, meta.week, meta.lecture, t.id)
      ).length
    : 0;

  const isAllDone =
    meta.topics.length > 0 && completedTopicsCount === meta.topics.length;

  const subjectNames: Record<SubjectId, string> = {
    mlt: 'Machine Learning Techniques',
    mad2: 'Modern Application Development 2',
    bdm: 'Business Data Management',
  };

  const breadcrumbs = [
    { label: meta.subject.toUpperCase(), href: `/${meta.subject}` },
    { label: `Week ${meta.week}`, href: `/${meta.subject}/week-${meta.week}` },
    { label: `Lecture ${meta.lecture}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Breadcrumbs */}
      <div className="mb-6 space-y-3">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                {subjectNames[meta.subject]} • Week {meta.week}
              </span>
              {mounted && isAllDone && (
                <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Lecture Completed
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {meta.title}
            </h1>
          </div>

          {/* Quick Prev / Next Lecture buttons */}
          <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
            {prevLecture ? (
              <Link
                href={prevLecture.url}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                title={`Previous: ${prevLecture.title}`}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <span className="p-2 rounded-xl border border-zinc-100 dark:border-zinc-800/40 text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                <ArrowLeft className="w-4 h-4" />
              </span>
            )}

            {nextLecture ? (
              <Link
                href={nextLecture.url}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                title={`Next: ${nextLecture.title}`}
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="p-2 rounded-xl border border-zinc-100 dark:border-zinc-800/40 text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <LectureTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        subject={meta.subject}
        selfTestCount={meta.selfTest?.length || 0}
        resourceCount={meta.resources?.length || 0}
      />

      {/* Main Layout: Left Sidebar + Tab Content */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Sticky Sidebar only visible when Notes tab is active */}
        {activeTab === 'notes' && (
          <TopicSidebar
            topics={meta.topics}
            activeTopicId={activeTopicId}
            onSelectTopic={handleSelectTopic}
            subject={meta.subject}
            week={meta.week}
            lecture={meta.lecture}
          />
        )}

        {/* Tab Contents */}
        <div className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab meta={meta} onJumpToTopic={handleSelectTopic} />
          )}

          {activeTab === 'notes' && (
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {contentChildren}
            </div>
          )}

          {activeTab === 'formulas-code' && (
            <>
              {meta.subject === 'mad2' ? (
                <CodeTab
                  codeSnippets={meta.codeSnippets}
                  projectTree={meta.projectTree}
                />
              ) : (
                <FormulasTab formulas={meta.formulas} />
              )}
            </>
          )}

          {activeTab === 'selftest' && (
            <SelfTest
              questions={meta.selfTest || []}
              subject={meta.subject}
              week={meta.week}
              lecture={meta.lecture}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesList resources={meta.resources || []} />
          )}

          {/* Bottom Lecture Navigation */}
          <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            <div>
              {prevLecture && (
                <Link
                  href={prevLecture.url}
                  className="flex items-center space-x-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Lecture</span>
                </Link>
              )}
            </div>

            <div>
              {nextLecture && (
                <Link
                  href={nextLecture.url}
                  className="flex items-center space-x-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <span>Next Lecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


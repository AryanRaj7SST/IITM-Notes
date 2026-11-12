'use client';

import React from 'react';
import { SubjectId } from '@/types';
import { BookOpen, FileText, Sigma, Code, HelpCircle, ExternalLink } from 'lucide-react';

export type LectureTabKey = 'overview' | 'notes' | 'formulas-code' | 'selftest' | 'resources';

interface LectureTabsProps {
  activeTab: LectureTabKey;
  onChangeTab: (tab: LectureTabKey) => void;
  subject: SubjectId;
  selfTestCount?: number;
  resourceCount?: number;
}

export function LectureTabs({
  activeTab,
  onChangeTab,
  subject,
  selfTestCount = 0,
  resourceCount = 0,
}: LectureTabsProps) {
  const isMad2 = subject === 'mad2';
  const formulasOrCodeLabel = isMad2 ? 'Code' : 'Formulas';
  const FormulasOrCodeIcon = isMad2 ? Code : Sigma;

  const tabs: { key: LectureTabKey; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: BookOpen },
    { key: 'notes', label: 'Notes', icon: FileText },
    { key: 'formulas-code', label: formulasOrCodeLabel, icon: FormulasOrCodeIcon },
    { key: 'selftest', label: 'Self-test', icon: HelpCircle, badge: selfTestCount },
    { key: 'resources', label: 'Resources', icon: ExternalLink, badge: resourceCount },
  ];

  const getAccentPill = () => {
    switch (subject) {
      case 'mlt':
        return 'bg-emerald-600 text-white dark:bg-emerald-500';
      case 'mad2':
        return 'bg-sky-600 text-white dark:bg-sky-500';
      case 'bdm':
        return 'bg-violet-600 text-white dark:bg-violet-500';
      default:
        return 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900';
    }
  };

  return (
    <div className="w-full border-b border-zinc-200 dark:border-zinc-800 pb-px">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTab(tab.key)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
                isActive
                  ? `${getAccentPill()} shadow-sm`
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


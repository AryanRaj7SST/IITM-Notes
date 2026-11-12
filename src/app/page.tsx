import React from 'react';
import { getAllSubjectsSummary } from '@/lib/content';
import { SubjectCard } from '@/components/cards/SubjectCard';
import { Sparkles, Terminal, BookMarked, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const subjects = getAllSubjectsSummary();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>IIT Madras BS Degree In-Depth Study Notes</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Rigorous, Minimalist & Interactive Course Notes
        </h1>

        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Distilled directly from course lecture transcripts with step-by-step mathematical proofs, tested code architectures, business data frameworks, and self-testing quizzes.
        </p>
      </div>

      {/* 3 Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((summary) => (
          <SubjectCard key={summary.meta.id} summary={summary} />
        ))}
      </div>

      {/* Feature Pillars */}
      <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Machine Learning Techniques
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every formula rendered in KaTeX with rigorous step-by-step derivations, verified using SymPy and accompanied by accurate loss surface graphs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Modern App Development 2
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Tested FastAPI and Vue 3 code blocks with line numbers, copy buttons, expected output, and complete folder trees.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Business Data Management
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Exact academic definitions paired with plain-language explanations, relational schema flows, and enterprise workload trade-offs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


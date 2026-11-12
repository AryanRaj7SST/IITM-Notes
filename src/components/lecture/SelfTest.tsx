'use client';

import React, { useState, useEffect } from 'react';
import { SelfTestQuestion, SubjectId } from '@/types';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, RotateCcw, ThumbsUp, AlertTriangle } from 'lucide-react';
import { getQuizScore, saveQuizScore, useProgressNotifier } from '@/lib/storage';

interface SelfTestProps {
  questions: SelfTestQuestion[];
  subject: SubjectId;
  week: number;
  lecture: number;
}

export function SelfTest({ questions, subject, week, lecture }: SelfTestProps) {
  const progressTick = useProgressNotifier();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [scores, setScores] = useState<Record<number, 'known' | 'review'>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setScores(getQuizScore(subject, week, lecture));
  }, [subject, week, lecture, progressTick]);

  const toggleReveal = (idx: number) => {
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleScore = (idx: number, status: 'known' | 'review') => {
    saveQuizScore(subject, week, lecture, idx, status);
    setScores((prev) => ({ ...prev, [idx]: status }));
  };

  const resetAll = () => {
    questions.forEach((_, idx) => {
      saveQuizScore(subject, week, lecture, idx, 'review');
    });
    setScores({});
    setRevealed({});
  };

  const knownCount = Object.values(scores).filter((s) => s === 'known').length;
  const answeredCount = Object.keys(scores).length;

  return (
    <div className="space-y-6 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-2">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-zinc-500" />
            Lecture Concept Self-Test
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Test your comprehension of definitions, proofs, and edge cases. Click to reveal solutions.
          </p>
        </div>

        {answeredCount > 0 && (
          <button
            onClick={resetAll}
            className="flex items-center text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Test
          </button>
        )}
      </div>

      {/* Question Cards */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isRevealed = revealed[idx];
          const userStatus = scores[idx];

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                userStatus === 'known'
                  ? 'border-emerald-500/30 bg-white dark:bg-zinc-900'
                  : userStatus === 'review'
                  ? 'border-amber-500/30 bg-white dark:bg-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              {/* Question Header */}
              <div
                onClick={() => toggleReveal(idx)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <div className="flex items-start space-x-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {q.question}
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {userStatus === 'known' && (
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Mastered
                    </span>
                  )}
                  {userStatus === 'review' && (
                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      Needs Review
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={isRevealed ? 'Hide answer' : 'Reveal answer'}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {isRevealed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Revealed Answer & Explanation */}
              {isRevealed && (
                <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 animate-in fade-in duration-100">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Answer:
                    </span>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {q.answer}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      In-Depth Explanation:
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>

                  {/* Self-Rating buttons */}
                  <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">How did you do?</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleScore(idx, 'known')}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          userStatus === 'known'
                            ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>I knew this</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleScore(idx, 'review')}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          userStatus === 'review'
                            ? 'bg-amber-600 text-white dark:bg-amber-500'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Need review</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score Summary Card */}
      {mounted && answeredCount > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
          <div>
            <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
              Self-Test Mastery Score
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-white">
                {knownCount} / {questions.length}
              </span>
              <span className="text-xs text-zinc-400">
                ({Math.round((knownCount / questions.length) * 100)}% Mastered)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {knownCount === questions.length
                ? 'Excellent! You have solid conceptual clarity over all lecture definitions and edge cases.'
                : 'Review the flagged items above before attempting graded assignments.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}


'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Hash, ArrowRight } from 'lucide-react';
import { SearchIndexItem, SubjectId } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchIndexItem[]>([]);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index once on mount
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchIndexItem[]) => setItems(data))
      .catch((err) => console.error('Failed to load search index:', err));
  }, []);

  // Handle focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Fuzzy filter
  useEffect(() => {
    if (!query.trim()) {
      // Show first 6 items as default recommendations
      setResults(items.slice(0, 6));
      setSelectedIndex(0);
      return;
    }

    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/);

    const filtered = items.filter((item) => {
      const target = `${item.subjectCode} ${item.subjectName} ${item.lectureTitle} ${item.title} ${item.snippet}`.toLowerCase();
      return words.every((w) => target.includes(w));
    });

    setResults(filtered.slice(0, 10));
    setSelectedIndex(0);
  }, [query, items]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (item: SearchIndexItem) => {
    onClose();
    router.push(item.url);
  };

  if (!isOpen) return null;

  const getSubjectBadge = (subject: SubjectId) => {
    switch (subject) {
      case 'mlt':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'mad2':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
      case 'bdm':
        return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, formulas, topics, or code (e.g. Normal Equation, REST, ACID)..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getSubjectBadge(
                          item.subject
                        )}`}
                      >
                        {item.subjectCode}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        W{item.week} • L{item.lecture}
                      </span>
                    </div>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />}
                  </div>

                  <div className="flex items-start space-x-2">
                    {item.topicId ? (
                      <Hash className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-semibold leading-snug">{item.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        {item.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No matching notes found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-[10px]">↑</kbd>{' '}
              <kbd className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-[10px]">↓</kbd> navigate
            </span>
            <span>
              <kbd className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-[10px]">↵</kbd> select
            </span>
          </div>
          <span>Offline Client Index</span>
        </div>
      </div>
    </div>
  );
}


'use client';

import React from 'react';
import { CodeSnippetItem } from '@/types';
import { CodeBlock } from './CodeBlock';
import { Code, FolderTree } from 'lucide-react';

interface CodeTabProps {
  codeSnippets?: CodeSnippetItem[];
  projectTree?: string;
}

export function CodeTab({ codeSnippets, projectTree }: CodeTabProps) {
  if ((!codeSnippets || codeSnippets.length === 0) && !projectTree) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        No code artifacts or project trees attached to this lecture.
      </div>
    );
  }

  return (
    <div className="space-y-8 my-6">
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center">
          <Code className="w-5 h-5 mr-2 text-zinc-500" />
          Code Artifacts, Project Layout & Line Explanations
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Tested source implementations, directory hierarchy, and line-by-line architectural breakdown.
        </p>
      </div>

      {/* Project Folder Tree if available */}
      {projectTree && (
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <FolderTree className="w-4 h-4 text-sky-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Recommended Project Directory Tree
            </h4>
          </div>
          <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
            {projectTree}
          </pre>
        </div>
      )}

      {/* Code Snippets */}
      {codeSnippets &&
        codeSnippets.map((snippet, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
          >
            <div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {snippet.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                File: <span className="font-mono text-zinc-300">{snippet.filename}</span>
              </p>
            </div>

            <CodeBlock
              code={snippet.code}
              filename={snippet.filename}
              language={snippet.language}
              tested={snippet.tested}
            />

            {/* Line Explanations */}
            {snippet.explanations && snippet.explanations.length > 0 && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                  What Each Part Does (By Line):
                </span>
                <div className="space-y-2">
                  {snippet.explanations.map((exp, eIdx) => (
                    <div
                      key={eIdx}
                      className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-start space-x-3 text-xs"
                    >
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                        Lines {exp.lines}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {exp.explanation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Output */}
            {snippet.output && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                  Expected Execution Output:
                </span>
                <pre className="p-3.5 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto">
                  {snippet.output}
                </pre>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}


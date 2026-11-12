'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  tested?: boolean;
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  tested,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code:', e);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-md">
      {/* Code Header */}
      <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {filename ? (
            <FileCode className="w-4 h-4 text-sky-400" />
          ) : (
            <Terminal className="w-4 h-4 text-zinc-400" />
          )}
          <span className="font-mono text-xs font-semibold text-zinc-300">
            {filename || language}
          </span>
          {tested !== undefined && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                tested
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {tested ? 'tested' : 'untested'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
          title="Copy snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Lines with line numbers */}
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/60">
                <td className="w-10 pr-4 text-right text-zinc-600 select-none text-xs font-mono align-top py-0.5">
                  {idx + 1}
                </td>
                <td className="text-zinc-200 font-mono whitespace-pre py-0.5">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


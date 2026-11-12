'use client';

import React from 'react';
import { FormulaItem } from '@/types';
import katex from 'katex';
import { Sigma } from 'lucide-react';

interface FormulasTabProps {
  formulas?: FormulaItem[];
}

export function FormulasTab({ formulas }: FormulasTabProps) {
  if (!formulas || formulas.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        No formal mathematical formulas recorded for this lecture.
      </div>
    );
  }

  const renderFormula = (latex: string) => {
    try {
      return {
        __html: katex.renderToString(latex, {
          throwOnError: false,
          displayMode: true,
        }),
      };
    } catch {
      return { __html: latex };
    }
  };

  const renderInlineMath = (latex: string) => {
    try {
      return {
        __html: katex.renderToString(latex, {
          throwOnError: false,
          displayMode: false,
        }),
      };
    } catch {
      return { __html: latex };
    }
  };

  return (
    <div className="space-y-6 my-6">
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center">
          <Sigma className="w-5 h-5 mr-2 text-zinc-500" />
          Formulas Reference & Symbol Definitions
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Equations, loss functions, and exact mathematical formulations introduced in this lecture.
        </p>
      </div>

      <div className="space-y-6">
        {formulas.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {item.name}
              </h4>
              <span className="text-xs font-mono text-zinc-400">Eq {idx + 1}</span>
            </div>

            {/* Rendered Equation */}
            <div className="py-3 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 overflow-x-auto text-center">
              <div
                dangerouslySetInnerHTML={renderFormula(item.latex)}
                className="py-1"
              />
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {item.description}
            </p>

            {/* Symbol Definitions Table */}
            {item.symbols && item.symbols.length > 0 && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                  Symbol Definitions:
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400">
                        <th className="py-1.5 pr-4 font-semibold w-1/4">Symbol</th>
                        <th className="py-1.5 font-semibold">Formal Definition / Dimensions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                      {item.symbols.map((sym, sIdx) => (
                        <tr key={sIdx}>
                          <td className="py-2 pr-4 font-mono text-zinc-800 dark:text-zinc-200">
                            <span dangerouslySetInnerHTML={renderInlineMath(sym.symbol)} />
                          </td>
                          <td className="py-2 text-zinc-600 dark:text-zinc-400">
                            {sym.meaning}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


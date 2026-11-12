import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  accentColor?: 'emerald' | 'sky' | 'violet' | 'zinc';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  progress,
  accentColor = 'zinc',
  showLabel = false,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    sky: 'bg-sky-500 dark:bg-sky-400',
    violet: 'bg-violet-500 dark:bg-violet-400',
    zinc: 'bg-zinc-800 dark:bg-zinc-200',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-zinc-600 dark:text-zinc-400">
          <span>Progress</span>
          <span className="font-mono">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${sizeClasses[size]} ${colorClasses[accentColor]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}


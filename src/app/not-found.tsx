import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <span className="text-4xl font-extrabold text-zinc-300 dark:text-zinc-700 font-mono">
        404
      </span>
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Page Not Found
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        The requested lecture notes or subject module could not be found or hasn&apos;t been added yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}


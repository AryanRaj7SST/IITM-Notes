import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { Navbar } from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'IIT Madras BS Degree Notes | Interactive Study Portal',
  description: 'Minimalist, interactive, and rigorous study notes for Machine Learning Techniques (MLT), Modern App Development 2 (MAD 2), and Business Data Management (BDM).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('iitm_theme');
                const isDark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) document.documentElement.classList.add('dark');
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>IIT Madras BS Degree In-Depth Study Notes • Open & Static</p>
              <p className="font-mono text-[11px]">Deployable on Vercel & GitHub Pages</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}


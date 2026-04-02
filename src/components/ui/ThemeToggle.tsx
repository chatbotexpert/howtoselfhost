'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-full h-full text-yellow-500 transition-all duration-500 rotate-0 scale-100" />
        ) : (
          <Moon className="w-full h-full text-slate-700 transition-all duration-500 rotate-0 scale-100" />
        )}
      </div>
      
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}

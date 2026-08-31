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
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950"
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="group relative w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 hover:border-brand-500 transition-all duration-300 overflow-hidden"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-full h-full text-yellow-500 transition-all duration-500 rotate-0 scale-100" />
        ) : (
          <Moon className="w-full h-full text-slate-700 transition-all duration-500 rotate-0 scale-100" />
        )}
      </div>
      
      <div className="absolute inset-0 bg-slate-200 dark:bg-gray-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </button>
  );
}

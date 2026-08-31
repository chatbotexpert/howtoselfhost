'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Terminal, ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-slate-200 dark:border-gray-800 bg-slate-50/90 dark:bg-gray-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-sm border border-slate-300 dark:border-gray-700 flex items-center justify-center group-hover:border-brand-500 transition-colors duration-200">
              <Terminal className="w-4 h-4 text-brand-500" />
            </div>
            <span className="font-serif text-lg font-bold text-gray-900 dark:text-white tracking-wide">
              howtoselfhost
              <span className="text-brand-500">.com</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-1 py-1 mx-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 border-b-2',
                  pathname === link.href
                    ? 'border-brand-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-gray-700'
                )}
              >
                {link.label}
              </Link>
            ))}
            {/* VPS Services external link */}
            <a
              href="https://vps-howtoselfhost-com.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 ml-2 rounded-sm border border-brand-500 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors duration-200"
            >
              Buy VPS
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-sm border border-slate-300 dark:border-gray-700 hover:border-brand-500 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-3 border-b border-slate-200 dark:border-gray-800 text-xs font-bold uppercase tracking-widest transition-colors duration-200',
                  pathname === link.href
                    ? 'text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-900'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://vps-howtoselfhost-com.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 px-3 py-3 mt-2 rounded-sm border border-brand-500 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors duration-200"
            >
              Buy VPS
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

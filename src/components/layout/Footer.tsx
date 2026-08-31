import Link from 'next/link';
import { Terminal, Github, Rss, ExternalLink } from 'lucide-react';

const footerLinks = {
  Content: [
    { href: '/blog', label: 'Blog' },
    { href: '/blog?category=docker', label: 'Docker' },
    { href: '/blog?category=nginx', label: 'Nginx' },
    { href: '/blog?category=databases', label: 'Databases' },
  ],
  Topics: [
    { href: '/blog?category=vps', label: 'VPS' },
    { href: '/blog?category=security', label: 'Security' },
    { href: '/blog?category=monitoring', label: 'Monitoring' },
  ],
  Site: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-7 h-7 rounded-sm border border-slate-300 dark:border-gray-700 flex items-center justify-center group-hover:border-brand-500 transition-colors duration-200">
                <Terminal className="w-3.5 h-3.5 text-brand-500" />
              </div>
              <span className="font-serif text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                howtoselfhost<span className="text-brand-500">.com</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Practical guides for self-hosting your own infrastructure. From Docker containers to VPS setup.
            </p>
            {/* VPS Services link */}
            <a
              href="https://vps-howtoselfhost-com.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-[11px] uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors duration-200"
            >
              VPS Services
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="/rss.xml"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label="RSS Feed"
              >
                <Rss className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-slate-800 dark:text-gray-200 font-bold text-[11px] uppercase tracking-widest mb-4">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 dark:text-gray-400 text-sm italic">
            © {currentYear} howtoselfhost.com — Self-host everything.
          </p>
          <p className="text-slate-400 dark:text-gray-500 text-[11px] uppercase tracking-widest">
            Built with Next.js + PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}

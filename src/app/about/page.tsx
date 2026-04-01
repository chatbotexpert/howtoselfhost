import Link from 'next/link';
import { Terminal, Server, Shield, Database, Globe, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about howtoselfhost.com — practical guides for self-hosting your own infrastructure.',
};

const techStack = [
  { icon: Terminal, label: 'Docker & Docker Compose', color: 'text-blue-400' },
  { icon: Server, label: 'Linux VPS (Ubuntu/Debian)', color: 'text-purple-400' },
  { icon: Globe, label: 'Nginx Reverse Proxy', color: 'text-green-400' },
  { icon: Database, label: 'PostgreSQL & SQLite', color: 'text-orange-400' },
  { icon: Shield, label: 'Let\'s Encrypt SSL', color: 'text-red-400' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400 font-mono mb-6">
            <Terminal className="w-3 h-3" />
            about this site
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            About howtoselfhost.com
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            A practical resource for self-hosters who want to own their
            infrastructure without the complexity.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <div className="prose prose-invert">
            <p className="text-gray-300 leading-relaxed mb-4">
              Self-hosting has become more accessible than ever, but the
              documentation is scattered across forums, GitHub READMEs, and
              decade-old blog posts. howtoselfhost.com exists to fix that.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Every guide here is written to be production-ready from day one.
              We don&apos;t just show you how to make something work in
              development — we show you how to do it right, with proper security,
              backups, and monitoring.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Whether you&apos;re running a personal blog, a small business, or
              an entire homelab, you&apos;ll find practical, copy-paste-ready
              guides here.
            </p>
          </div>
        </section>

        {/* What we cover */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Technologies We Cover
          </h2>
          <div className="space-y-3">
            {techStack.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800"
                >
                  <Icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                  <span className="text-gray-200 text-sm">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-12 p-6 rounded-xl bg-green-500/5 border border-green-500/20">
          <h2 className="text-xl font-bold text-white mb-3">
            Our Philosophy
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">→</span>
              <span>Every tutorial should work on a fresh server install</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">→</span>
              <span>Security is not optional — every guide includes hardening steps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">→</span>
              <span>Backups are part of the setup, not an afterthought</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">→</span>
              <span>Copy-paste commands should work without modification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">→</span>
              <span>We explain the &apos;why&apos;, not just the &apos;how&apos;</span>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Start Reading
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

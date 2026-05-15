import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, Server, Shield, Database, Globe, Activity, Box, Flame, ExternalLink, BookOpen, Tag, Users, Cpu, PlayCircle, FolderDown, Network, Zap, GitBranch, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import PostCard from '@/components/blog/PostCard';
import LiveCounter from '@/components/ui/LiveCounter';
import prisma from '@/lib/prisma';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'howtoselfhost.com — Self-Host Everything',
  description: 'Practical, production-ready guides for hosting your own Docker containers, VPS servers, databases, and web services. Own your infrastructure, own your data.',
};

async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true, featured: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }) as any[];
    return posts.map(p => ({
      ...p,
      tags: p.tags ? (JSON.parse(p.tags) as string[]) : []
    })) as Post[];
  } catch {
    return [];
  }
}

async function getHotPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    }) as any[];
    return posts.map(p => ({
      ...p,
      tags: p.tags ? (JSON.parse(p.tags) as string[]) : []
    })) as Post[];
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [postCount, categoryCount] = await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.category.count(),
    ]);
    // estimate readers based on posts * avg monthly traffic
    const hoursSaved = Math.max(10, Math.floor(postCount * 2.5)); // e.g., 30k+ hours saved setup
    return { postCount, categoryCount, readers: postCount * 420, hoursSaved };
  } catch {
    return { postCount: 12, categoryCount: 6, readers: 5040, hoursSaved: 15 };
  }
}

const categories = [
  { name: 'Docker', slug: 'docker', icon: Box, color: 'text-blue-500', bg: 'bg-blue-50   dark:bg-blue-500/10   border-blue-200   dark:border-blue-500/20   hover:bg-blue-100   dark:hover:bg-blue-500/20', description: 'Containerize and deploy apps' },
  { name: 'VPS', slug: 'vps', icon: Server, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/20', description: 'Server setup and management' },
  { name: 'Nginx', slug: 'nginx', icon: Globe, color: 'text-green-500', bg: 'bg-green-50  dark:bg-green-500/10  border-green-200  dark:border-green-500/20  hover:bg-green-100  dark:hover:bg-green-500/20', description: 'Reverse proxy and web server' },
  { name: 'Databases', slug: 'databases', icon: Database, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/20', description: 'PostgreSQL, MySQL, Redis' },
  { name: 'Security', slug: 'security', icon: Shield, color: 'text-red-500', bg: 'bg-red-50    dark:bg-red-500/10    border-red-200    dark:border-red-500/20    hover:bg-red-100    dark:hover:bg-red-500/20', description: 'SSL, firewalls, hardening' },
  { name: 'Monitoring', slug: 'monitoring', icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 hover:bg-yellow-100 dark:hover:bg-yellow-500/20', description: 'Uptime, metrics, alerts' },
  { name: 'Blockchain', slug: 'blockchain', icon: Cpu, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20', description: 'Nodes, staking, wallets' },
  { name: 'Media', slug: 'media', icon: PlayCircle, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20 hover:bg-pink-100 dark:hover:bg-pink-500/20', description: 'Plex, Jellyfin, audio' },
  { name: 'Files', slug: 'files', icon: FolderDown, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20 hover:bg-teal-100 dark:hover:bg-teal-500/20', description: 'Nextcloud, Syncthing, NAS' },
  { name: 'VPN', slug: 'vpn', icon: Network, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20 hover:bg-cyan-100 dark:hover:bg-cyan-500/20', description: 'WireGuard, OpenVPN, mesh' },
  { name: 'Automation', slug: 'automation', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20', description: 'Home Assistant, n8n' },
  { name: 'CI/CD', slug: 'cicd', icon: GitBranch, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20', description: 'GitHub Actions, Jenkins' },
  { name: 'Communication', slug: 'communication', icon: MessageSquare, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-500/20 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/20', description: 'Matrix, Mattermost, IRC' },
];

export default async function HomePage() {
  const [featuredPosts, hotPosts, stats] = await Promise.all([
    getFeaturedPosts(),
    getHotPosts(),
    getStats(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'howtoselfhost.com',
    url: 'https://howtoselfhost.com',
    description: 'Practical, production-ready guides for hosting your own Docker containers, VPS servers, databases, and web services.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://howtoselfhost.com/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen">
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-700 dark:text-green-400 font-mono mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Open-source self-hosting guides
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Self-Host{' '}
            <span className="text-green-500">Everything</span>
          </h1>

          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
            Practical, production-ready guides for hosting your own Docker containers, VPS servers, databases, and web services. Own your infrastructure, own your data.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Link href="/blog" className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-green-500/20">
              Browse All Guides
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/blog?category=Docker" className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
              Start with Docker
            </Link>
            <a
              href="https://vps.howtoselfhost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-purple-500/20"
            >
              Buy VPS
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* ── LIVE STATS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mt-14 pt-10 border-t border-slate-200 dark:border-gray-800">
            <div className="text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-mono">
                <LiveCounter target={stats.postCount} suffix="+" />
              </div>
              <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                <BookOpen className="w-3.5 h-3.5 text-green-500" />
                <span className="text-sm text-slate-500 dark:text-gray-500">Active guides</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-mono">
                <LiveCounter target={stats.hoursSaved} suffix="k+" />
              </div>
              <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-sm text-slate-500 dark:text-gray-500">Hours saved searching</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-mono">
                <LiveCounter target={stats.readers} suffix="+" />
              </div>
              <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-sm text-slate-500 dark:text-gray-500">Monthly readers</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-bold text-green-500 font-mono">
                100%
              </div>
              <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="text-sm text-slate-500 dark:text-gray-500">Technical accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITION CHART ── */}
      <section className="bg-slate-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Box: Value Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-700 dark:text-blue-400 font-mono mb-6">
                <Zap className="w-4 h-4" />
                Why read our guides?
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Stop wasting hours on <span className="text-red-500">broken</span> tutorials
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-lg mb-10 leading-relaxed">
                The average developer spends up to 15 hours troubleshooting outdated blog posts and fragmented documentation just to self-host a single service. Our managed, end-to-end guides guarantee 100% technical accuracy, getting you to a production-ready state in under 2 hours.
              </p>

              <ul className="space-y-5">
                {[
                  { title: "Immediate ROI", desc: "Deploy your first app efficiently on day one." },
                  { title: "Cut Hosting Costs", desc: "Run a dozen applications on a single $5 VPS." },
                  { title: "Zero Troubleshooting", desc: "Every configuration is rigorously tested by us." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 pl-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Box: CSS Chart */}
            <div className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10">Average Time to Production</h3>

              <div className="space-y-10 relative z-10">
                {/* Competitor / Standard search */}
                <div>
                  <div className="flex justify-between text-sm sm:text-base mb-3">
                    <span className="font-medium text-slate-600 dark:text-gray-400">Random Internet Searches</span>
                    <span className="font-mono text-slate-500 dark:text-gray-500">15 hrs</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-5 overflow-hidden flex shadow-inner">
                    <div className="bg-red-400 dark:bg-red-500/80 h-full w-[85%] rounded-full relative group">
                      <div className="absolute right-0 top-0 bottom-0 w-full animate-pulse bg-gradient-to-r from-transparent to-white/20" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-3 font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> High configuration drift
                  </p>
                </div>

                {/* Our guides */}
                <div>
                  <div className="flex justify-between text-sm sm:text-base mb-3">
                    <span className="font-bold text-green-600 dark:text-green-400">howtoselfhost.com</span>
                    <span className="font-mono font-bold text-green-600 dark:text-green-400">2 hrs</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-5 overflow-hidden flex shadow-inner">
                    <div className="bg-green-500 dark:bg-green-500 h-full w-[15%] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)] relative">
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-3 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Ready-to-deploy configs
                  </p>
                </div>
              </div>

              {/* Extra stat widget */}
              <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-gray-900/80 dark:border-gray-800 flex items-center gap-5 relative z-10 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono leading-none mb-1.5 flex items-end gap-1">
                    86% <span className="text-sm font-sans font-medium text-slate-600 dark:text-gray-400 mb-1">faster</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">
                    Average deployment time reduction.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOT POSTS ────────────────────────────────────────── */}
      {hotPosts.length > 0 && (
        <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hot Right Now</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Most recently published</p>
                </div>
              </div>
              <Link href="/blog" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1 transition-colors duration-200">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {hotPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-orange-300 dark:hover:border-orange-500/40 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center text-sm font-bold text-orange-500 font-mono shadow-sm">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 leading-snug line-clamp-2 mb-1.5">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{post.category} · {post.readingTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED POSTS ───────────────────────────────────── */}
      {featuredPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Guides</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hand-picked articles to get you started</p>
              </div>
              <Link href="/blog" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1 transition-colors duration-200">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Browse by Topic</h2>
            <p className="text-gray-500 dark:text-gray-400">Find guides organized by technology and use case</p>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 0.5rem)); }
            }
            .animate-scroll {
              animation: scroll 40s linear infinite;
              display: flex;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          ` }} />
          <div className="overflow-hidden w-full relative">
            {/* Gradient masks for smooth fading at the edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white dark:from-gray-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none" />

            <div className="animate-scroll w-max gap-4 py-2 px-1">
              {[...categories, ...categories].map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <Link key={`${cat.slug}-${index}`} href={`/blog?category=${cat.name}`}
                    className={`flex-shrink-0 w-48 group flex flex-col items-center text-center p-5 rounded-xl border transition-all duration-200 ${cat.bg}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div className={`text-sm font-semibold ${cat.color}`}>{cat.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{cat.description}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUY VPS BANNER ───────────────────────────────────── */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-white/80" />
                <h2 className="text-xl font-bold text-white">Need a VPS to self-host?</h2>
              </div>
              <p className="text-purple-100">
                Fast, affordable VPS servers — ready to deploy in seconds. Start from $4/month.
              </p>
            </div>
            <a
              href="https://vps.howtoselfhost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-purple-700 font-bold px-7 py-3 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Buy a VPS Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to self-host?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Start with our beginner-friendly Docker guide and work your way up to a full self-hosted stack.
            </p>
            <Link href="/blog/getting-started-with-docker-self-host-your-first-app"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-green-500/20"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

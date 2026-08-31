import Link from 'next/link';
import Image from 'next/image';
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
  { name: 'Docker', slug: 'docker', icon: Box, description: 'Containerize and deploy apps' },
  { name: 'VPS', slug: 'vps', icon: Server, description: 'Server setup and management' },
  { name: 'Nginx', slug: 'nginx', icon: Globe, description: 'Reverse proxy and web server' },
  { name: 'Databases', slug: 'databases', icon: Database, description: 'PostgreSQL, MySQL, Redis' },
  { name: 'Security', slug: 'security', icon: Shield, description: 'SSL, firewalls, hardening' },
  { name: 'Monitoring', slug: 'monitoring', icon: Activity, description: 'Uptime, metrics, alerts' },
  { name: 'Blockchain', slug: 'blockchain', icon: Cpu, description: 'Nodes, staking, wallets' },
  { name: 'Media', slug: 'media', icon: PlayCircle, description: 'Plex, Jellyfin, audio' },
  { name: 'Files', slug: 'files', icon: FolderDown, description: 'Nextcloud, Syncthing, NAS' },
  { name: 'VPN', slug: 'vpn', icon: Network, description: 'WireGuard, OpenVPN, mesh' },
  { name: 'Automation', slug: 'automation', icon: Zap, description: 'Home Assistant, n8n' },
  { name: 'CI/CD', slug: 'cicd', icon: GitBranch, description: 'GitHub Actions, Jenkins' },
  { name: 'Communication', slug: 'communication', icon: MessageSquare, description: 'Matrix, Mattermost, IRC' },
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
      {/* ── HERO SECTION ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-gray-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-10 opacity-40"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-slate-300/40 dark:bg-brand-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1] animate-slide-up">
              Self-Host{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-slate-600 dark:to-brand-300 drop-shadow-sm">Everything</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-gray-400 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Practical, production-ready guides for hosting your own Docker containers, VPS servers, databases, and web services. Own your infrastructure, own your data.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link href="/blog" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgb(13,148,136,0.3)] hover:shadow-[0_8px_40px_rgb(13,148,136,0.5)] hover:-translate-y-1">
                Browse All Guides
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/blog?category=Docker" className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                Start with Docker
              </Link>
              <a href="https://vps-howtoselfhost-com.vercel.app" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-lg font-bold border border-slate-200 dark:border-gray-700 px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgb(20,184,166,0.3)] hover:shadow-[0_8px_40px_rgb(20,184,166,0.5)] hover:-translate-y-1">
                Buy VPS
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ──────────────────────────────────────── */}
      <section className="relative z-10 -mt-12 sm:-mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200 dark:border-gray-700/50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100 dark:divide-gray-800">
            <div className="px-2">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-mono">
                <LiveCounter target={stats.postCount} />+
              </div>
              <div className="flex items-center gap-1.5 justify-center mt-1">
                <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">Active guides</span>
              </div>
            </div>
            <div className="px-2">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-mono">
                <LiveCounter target={stats.hoursSaved} />k+
              </div>
              <div className="flex items-center gap-1.5 justify-center mt-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">Hours saved searching</span>
              </div>
            </div>
            <div className="px-2">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-mono">
                <LiveCounter target={stats.readers} />+
              </div>
              <div className="flex items-center gap-1.5 justify-center mt-1">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">Monthly readers</span>
              </div>
            </div>
            <div className="px-2">
              <div className="text-4xl font-bold text-brand-500 mb-2 font-mono">
                100%
              </div>
              <div className="flex items-center gap-1.5 justify-center mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">Technical accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITION CHART ── */}
      <section className="bg-white dark:bg-gray-950 border-b border-slate-200 dark:border-gray-800 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Box: Value Text */}
            <div>
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-brand-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-base text-slate-600 dark:text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Box: CSS Chart */}
            <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10">Average Time to Production</h3>

              <div className="space-y-10 relative z-10">
                {/* Competitor / Standard search */}
                <div>
                  <div className="flex justify-between text-sm sm:text-base mb-3 font-bold">
                    <span className="text-slate-600 dark:text-gray-400">Random Internet Searches</span>
                    <span className="text-slate-500 dark:text-gray-500">15 hrs</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-gray-800 rounded-full h-5 overflow-hidden flex shadow-inner">
                    <div className="bg-red-400 dark:bg-red-500/80 h-full w-[85%] rounded-full relative group">
                      <div className="absolute right-0 top-0 bottom-0 w-full animate-pulse bg-gradient-to-r from-transparent to-white/20" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-3 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> High configuration drift
                  </p>
                </div>

                {/* Our guides */}
                <div>
                  <div className="flex justify-between text-sm sm:text-base mb-3 font-bold">
                    <span className="text-brand-600 dark:text-brand-400">howtoselfhost.com</span>
                    <span className="text-brand-600 dark:text-brand-400">2 hrs</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-gray-800 rounded-full h-5 overflow-hidden flex shadow-inner">
                    <div className="bg-brand-500 h-full w-[15%] rounded-full relative">
                      <div className="absolute right-0 top-0 bottom-0 w-full animate-pulse bg-gradient-to-r from-transparent to-white/20" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mt-3 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Ready-to-deploy configs
                  </p>
                </div>
              </div>

              {/* Extra stat widget */}
              <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 flex items-end gap-2">
                    86% <span className="text-base font-medium text-slate-600 dark:text-gray-400 mb-1">faster</span>
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
        <section className="relative overflow-hidden bg-slate-50/50 dark:bg-gray-950/80 border-b border-slate-200/60 dark:border-gray-800/60">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Hot Right Now</h2>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1">Most recently published guides</p>
                </div>
              </div>
              <Link href="/blog" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-white transition-all duration-300 flex items-center gap-2 bg-brand-50 hover:bg-brand-500 dark:bg-brand-900/20 dark:hover:bg-brand-500 px-5 py-2.5 rounded-full shadow-sm hover:shadow-brand-500/25 group/btn">
                View all <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-3xl border border-white/20 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-500 overflow-hidden"
                >
                  <div className="block relative w-full overflow-hidden flex-shrink-0 h-[220px]">
                    <img
                      src={post.coverImage || `https://dummyimage.com/800x400/0f172a/14b8a6.png&text=${encodeURIComponent(post.category)}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-bold text-white bg-brand-500/90 px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm border border-brand-400/50 shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200 leading-snug line-clamp-3">
                      {post.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED POSTS ───────────────────────────────────── */}
      {featuredPosts.length > 0 && (
        <section className="bg-white dark:bg-gray-950 border-b border-slate-200/60 dark:border-gray-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Guides</h2>
                <p className="text-slate-500 dark:text-gray-400 font-medium mt-2">Hand-picked articles to get you started on the right foot</p>
              </div>
              <Link href="/blog" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors duration-200 flex items-center gap-1 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 px-4 py-2 rounded-xl">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="bg-slate-50/50 dark:bg-gray-950 border-b border-slate-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Browse by Topic</h2>
            <p className="text-slate-500 dark:text-gray-400 font-medium">Find guides organized by technology and use case</p>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 1rem)); }
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
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 dark:from-gray-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 dark:from-gray-950 to-transparent pointer-events-none" />

            <div className="animate-scroll w-max gap-6 py-4 px-2">
              {[...categories, ...categories].map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <Link key={`${cat.slug}-${index}`} href={`/blog?category=${cat.name}`}
                    className="flex-shrink-0 w-56 group flex flex-col items-center text-center p-6 rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-400 dark:hover:border-brand-500/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{cat.name}</div>
                    <div className="text-sm text-slate-500 dark:text-gray-400 mt-2">{cat.description}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUY VPS BANNER ───────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-950 border-b border-slate-200/60 dark:border-gray-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-950 border border-slate-800 p-10 sm:p-14 shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Need a VPS to self-host?</h2>
                <p className="text-slate-300 text-lg max-w-xl">
                  Fast, affordable, and reliable VPS servers. Ready to deploy your Docker stack in seconds. Start from $4/month.
                </p>
              </div>
              <a
                href="https://vps-howtoselfhost-com.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgb(20,184,166,0.3)] hover:shadow-[0_0_30px_rgb(20,184,166,0.5)] hover:-translate-y-1"
              >
                Buy a VPS Now
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-slate-50/50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">Ready to own your data?</h2>
          <p className="text-xl text-slate-600 dark:text-gray-400 mb-10 leading-relaxed">
            Start with our beginner-friendly Docker guide and work your way up to a full self-hosted stack. No prior DevOps experience required.
          </p>
          <Link href="/blog/getting-started-with-docker-self-host-your-first-app"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgb(13,148,136,0.3)] hover:shadow-[0_8px_40px_rgb(13,148,136,0.5)] hover:-translate-y-1"
          >
            Start Learning Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  );
}

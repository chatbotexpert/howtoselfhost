import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { serializeMDX, extractTableOfContents } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import CategoryBadge from '@/components/ui/CategoryBadge';
import TableOfContents from '@/components/blog/TableOfContents';
import MDXContent from '@/components/blog/MDXContent';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug, published: true },
    });
    if (!post) return null;
    const { tags, ...p } = post;
    return { ...p, tags: tags ? (JSON.parse(tags) as string[]) : [] } as Post;
  } catch {
    return null;
  }
}

async function getAdjacentPosts(currentSlug: string, publishedAt: Date | string | null) {
  try {
    const date = publishedAt ? new Date(publishedAt) : new Date();

    const [prevPost, nextPost] = await Promise.all([
      prisma.post.findFirst({
        where: {
          published: true,
          publishedAt: { lt: date },
          slug: { not: currentSlug },
        },
        orderBy: { publishedAt: 'desc' },
        select: { slug: true, title: true, category: true },
      }),
      prisma.post.findFirst({
        where: {
          published: true,
          publishedAt: { gt: date },
          slug: { not: currentSlug },
        },
        orderBy: { publishedAt: 'asc' },
        select: { slug: true, title: true, category: true },
      }),
    ]);

    return { prevPost, nextPost };
  } catch {
    return { prevPost: null, nextPost: null };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toString(),
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      }),
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const [mdxSource, { prevPost, nextPost }] = await Promise.all([
    serializeMDX(post.content),
    getAdjacentPosts(post.slug, post.publishedAt),
  ]);

  const tocItems = extractTableOfContents(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
    author: [{
      '@type': 'Organization',
      name: 'howtoselfhost.com',
      url: 'https://howtoselfhost.com',
    }],
    keywords: post.tags.join(', ')
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Cover Image Hero */}
      {post.coverImage && (
        <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-slate-100 dark:bg-gray-900 shadow-inner">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-contain drop-shadow-lg"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 dark:via-gray-950/20 dark:to-gray-950" />
        </div>
      )}

      {/* Post Header */}
      <div className="border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-300 transition-colors duration-200">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-300 transition-colors duration-200">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
          </div>

          <CategoryBadge category={post.category} className="mb-4" />

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6 max-w-4xl">
            {post.title}
          </h1>

          <p className="text-lg text-slate-500 dark:text-gray-400 max-w-3xl mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
              {formatDate(post.publishedAt ?? post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
              {post.readingTime} min read
            </span>
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 px-2 py-0.5 rounded border border-slate-200 dark:border-gray-700/50 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            <MDXContent source={mdxSource} />
          </article>

          {/* Sidebar TOC */}
          {tocItems.length > 0 && (
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <TableOfContents items={tocItems} />
            </aside>
          )}
        </div>

        {/* Prev/Next Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex flex-col p-5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-slate-50 dark:hover:bg-gray-900 hover:border-green-300 dark:hover:border-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-xs text-slate-400 dark:text-gray-500 flex items-center gap-1 mb-2">
                  <ArrowLeft className="w-3 h-3" />
                  Previous
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 leading-snug">
                  {prevPost.title}
                </span>
                <CategoryBadge category={prevPost.category} size="sm" className="mt-2 self-start" />
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex flex-col p-5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-slate-50 dark:hover:bg-gray-900 hover:border-green-300 dark:hover:border-gray-700 transition-all duration-200 sm:text-right shadow-sm hover:shadow-md"
              >
                <span className="text-xs text-slate-400 dark:text-gray-500 flex items-center gap-1 mb-2 sm:justify-end">
                  Next
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 leading-snug">
                  {nextPost.title}
                </span>
                <CategoryBadge category={nextPost.category} size="sm" className="mt-2 self-start sm:self-end" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all guides
          </Link>
        </div>
      </div>
    </div>
  );
}

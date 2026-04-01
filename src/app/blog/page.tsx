import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import type { Post } from '@/types';
import BlogClientPage from './BlogClientPage';

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
    return posts as Post[];
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Blog',
  description: 'All self-hosting guides covering Docker, VPS, Nginx, databases, security, and more.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <BlogClientPage initialPosts={posts} />
    </Suspense>
  );
}

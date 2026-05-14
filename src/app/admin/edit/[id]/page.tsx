import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PostEditor from '../../PostEditor';
import type { Post } from '@/types';
import { verifyToken } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Edit Post — Admin',
  robots: { index: false, follow: false },
};

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.email === process.env.ADMIN_EMAIL;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return null;
    return { ...post, tags: post.tags ? JSON.parse(post.tags) : [] } as Post;
  } catch {
    return null;
  }
}

export default async function EditPostPage({ params }: PageProps) {
  if (!(await isAuthenticated())) {
    redirect('/admin');
  }

  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    notFound();
  }

  return <PostEditor mode="edit" post={post} />;
}

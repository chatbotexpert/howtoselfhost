import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PostEditor from '../../PostEditor';
import type { Post } from '@/types';

export const metadata: Metadata = {
  title: 'Edit Post — Admin',
  robots: { index: false, follow: false },
};

function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const adminCookie = cookieStore.get('admin_token');
  return adminCookie?.value === process.env.ADMIN_SECRET;
}

interface PageProps {
  params: { id: string };
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
  if (!isAuthenticated()) {
    redirect('/admin');
  }

  const post = await getPost(params.id);
  if (!post) {
    notFound();
  }

  return <PostEditor mode="edit" post={post} />;
}

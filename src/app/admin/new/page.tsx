import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import PostEditor from '../PostEditor';
import { verifyToken } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'New Post — Admin',
  robots: { index: false, follow: false },
};

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.email === process.env.ADMIN_EMAIL;
}

export default async function NewPostPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin');
  }

  return <PostEditor mode="new" />;
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import PostEditor from '../PostEditor';

export const metadata: Metadata = {
  title: 'New Post — Admin',
  robots: { index: false, follow: false },
};

function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const adminCookie = cookieStore.get('admin_token');
  return adminCookie?.value === process.env.ADMIN_SECRET;
}

export default function NewPostPage() {
  if (!isAuthenticated()) {
    redirect('/admin');
  }

  return <PostEditor mode="new" />;
}

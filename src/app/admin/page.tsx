import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Terminal } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatDateShort } from '@/lib/utils';
import CategoryBadge from '@/components/ui/CategoryBadge';
import AdminLoginForm from './AdminLoginForm';
import AdminDeleteButton from './AdminDeleteButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.email === process.env.ADMIN_EMAIL;
}

async function getPosts() {
  try {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        published: true,
        featured: true,
        readingTime: true,
        createdAt: true,
        publishedAt: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  if (!await isAuthenticated()) {
    return <AdminLoginForm />;
  }

  const posts = await getPosts();
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-green-400" />
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-gray-400 text-sm">
              {posts.length} total posts · {publishedCount} published · {draftCount} drafts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              View Site
            </Link>
            <Link
              href="/admin/new"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-white font-mono">{posts.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total Posts</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 font-mono">{publishedCount}</div>
            <div className="text-xs text-gray-500 mt-1">Published</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400 font-mono">{draftCount}</div>
            <div className="text-xs text-gray-500 mt-1">Drafts</div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">All Posts</h2>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-4">No posts yet.</p>
              <Link
                href="/admin/new"
                className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      Title
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors duration-150"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {post.featured && (
                            <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-white leading-snug">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">
                              /{post.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <CategoryBadge category={post.category} size="sm" />
                      </td>
                      <td className="px-3 py-4">
                        {post.published ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                            <Eye className="w-3 h-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-xs text-gray-400">
                          {formatDateShort(post.publishedAt ?? post.createdAt)}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 text-gray-500 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                              title="View post"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/edit/${post.id}`}
                            className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors duration-150"
                            title="Edit post"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <AdminDeleteButton postId={post.id} postTitle={post.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="mt-6 text-right">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

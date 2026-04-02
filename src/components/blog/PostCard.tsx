import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatDateShort } from '@/lib/utils';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-300 dark:hover:border-green-500/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none">
      {/* Cover image — tall and prominent */}
      <Link href={`/blog/${post.slug}`} className="block relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0" style={{ height: featured ? '220px' : '200px' }}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder gradient when no image */
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-gray-100 to-blue-500/10 dark:from-green-500/20 dark:via-gray-800 dark:to-blue-500/20 flex items-center justify-center">
            <span className="font-mono text-4xl font-bold text-gray-200 dark:text-gray-700 select-none">
              {post.category.charAt(0)}
            </span>
          </div>
        )}
        {/* Category badge overlay on image */}
        <div className="absolute top-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
        {post.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-xs text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateShort(post.publishedAt ?? post.createdAt)}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="block flex-1 group/title">
          <h2 className={`font-bold text-gray-900 dark:text-white group-hover/title:text-green-600 dark:group-hover/title:text-green-400 transition-colors duration-200 leading-snug mb-2 ${featured ? 'text-xl' : 'text-lg'}`}>
            {post.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {post.tags && post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}

          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-200 flex-shrink-0"
          >
            Read more
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}

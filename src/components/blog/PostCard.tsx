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
    <article className="group relative flex flex-col rounded-3xl border border-white/20 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-500 overflow-hidden">
      {/* Cover image — tall and prominent */}
      <Link href={`/blog/${post.slug}`} className="block relative w-full overflow-hidden flex-shrink-0" style={{ height: featured ? '260px' : '220px' }}>
        <img
          src={post.coverImage || `https://picsum.photos/seed/${post.id}/800/400`}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Category badge overlay on image */}
        <div className="absolute top-4 left-4 z-10 shadow-md rounded-full overflow-hidden">
          <CategoryBadge category={post.category} className="bg-slate-900 text-white border-slate-700 shadow-md backdrop-blur-none" />
        </div>
        {post.featured && (
          <div className="absolute top-4 right-4 z-10 shadow-md">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest bg-brand-600 border border-brand-500 px-3 py-1.5 rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs italic text-slate-500 dark:text-gray-400 mb-4 border-b border-slate-200 dark:border-gray-800 pb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateShort(post.publishedAt ?? post.createdAt)}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-700" />
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="block flex-1 group/title">
          <h2 className={`font-serif font-bold text-slate-900 dark:text-white group-hover/title:text-brand-600 dark:group-hover/title:text-brand-400 transition-colors duration-200 leading-snug mb-3 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {post.title}
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
          {post.tags && post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest px-1">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}

          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400 transition-colors duration-200 flex-shrink-0"
          >
            Read more<span className="sr-only"> about {post.title}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}

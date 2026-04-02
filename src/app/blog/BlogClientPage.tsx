'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import PostCard from '@/components/blog/PostCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

const ALL_CATEGORIES = ['All', 'Docker', 'VPS', 'Nginx', 'Databases', 'Security', 'Monitoring', 'Blockchain', 'Media', 'Files', 'VPN', 'Automation', 'CI/CD', 'Communication'];

interface BlogClientPageProps {
  initialPosts: Post[];
}

export default function BlogClientPage({ initialPosts }: BlogClientPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') ?? 'All'
  );

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    if (activeCategory !== 'All') {
      posts = posts.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return posts;
  }, [initialPosts, activeCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      router.push('/blog', { scroll: false });
    } else {
      router.push(`/blog?category=${category}`, { scroll: false });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-3">All Guides</h1>
          <p className="text-gray-400 text-lg">
            {initialPosts.length} guides on self-hosting, Docker, VPS, and more.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                activeCategory === category
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-800 hover:text-gray-200'
              )}
            >
              {category}
              {category !== 'All' && (
                <span className="ml-1.5 text-xs opacity-60">
                  {initialPosts.filter((p) => p.category === category).length}
                </span>
              )}
              {category === 'All' && (
                <span className="ml-1.5 text-xs opacity-60">
                  {initialPosts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results summary */}
        {(searchQuery || activeCategory !== 'All') && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
            <span>
              {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
            </span>
            {searchQuery && (
              <>
                <span>for</span>
                <span className="text-white font-medium">"{searchQuery}"</span>
              </>
            )}
            {activeCategory !== 'All' && (
              <>
                <span>in</span>
                <CategoryBadge category={activeCategory} size="sm" />
              </>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('All');
              }}
              className="ml-auto text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors duration-200"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No guides found</h3>
            <p className="text-gray-400 mb-6">
              No guides match your current filters. Try a different search or category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('All');
              }}
              className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

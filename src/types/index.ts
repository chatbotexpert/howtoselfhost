export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  readingTime: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string | null;
}

export interface PostCardProps {
  post: Post;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export type CategoryName =
  | 'Docker'
  | 'VPS'
  | 'Nginx'
  | 'Databases'
  | 'Security'
  | 'Monitoring';

export const CATEGORY_COLORS: Record<string, string> = {
  Docker: 'blue',
  VPS: 'purple',
  Nginx: 'green',
  Databases: 'orange',
  Security: 'red',
  Monitoring: 'yellow',
};

export const CATEGORY_TAILWIND: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Docker: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  VPS: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  Nginx: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
  Databases: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
  },
  Security: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
  Monitoring: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
};

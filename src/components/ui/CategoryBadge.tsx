import { CATEGORY_TAILWIND } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function CategoryBadge({
  category,
  size = 'md',
  className,
}: CategoryBadgeProps) {
  const colors = CATEGORY_TAILWIND[category] ?? {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        colors.bg,
        colors.text,
        colors.border,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
        className
      )}
    >
      {category}
    </span>
  );
}

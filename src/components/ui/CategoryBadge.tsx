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
    bg: 'bg-slate-800 dark:bg-gray-800',
    text: 'text-white',
    border: 'border-slate-700 dark:border-gray-700',
  };

  // Enhance colors to be solid instead of transparent
  const solidBg = colors.bg.replace('/10', '').replace('/20', '').replace('bg-', 'bg-').replace('-500', '-600');
  const brightText = 'text-white';

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

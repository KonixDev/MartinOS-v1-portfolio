'use client';

import { cn } from '@/lib/utils';

export interface ToolbarDividerProps {
  className?: string;
}

/**
 * Vertical divider for separating toolbar button groups.
 */
export function ToolbarDivider({ className }: ToolbarDividerProps) {
  return (
    <div
      className={cn(
        'w-px h-5 mx-1',
        'bg-win-border dark:bg-win-dark-border',
        className
      )}
      role="separator"
      aria-orientation="vertical"
    />
  );
}

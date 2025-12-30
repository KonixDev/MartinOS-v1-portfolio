'use client';

import { cn } from '@/lib/utils';

export interface MenuDividerProps {
  className?: string;
}

/**
 * Horizontal divider for separating menu item groups.
 */
export function MenuDivider({ className }: MenuDividerProps) {
  return (
    <div
      className={cn(
        'h-px my-1 mx-2',
        'bg-win-border dark:bg-win-dark-border',
        className
      )}
      role="separator"
    />
  );
}

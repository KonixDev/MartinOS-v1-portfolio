'use client';

import { cn } from '@/lib/utils';

export interface StatusBarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Status bar component for displaying app information.
 *
 * @example
 * ```tsx
 * <StatusBar>
 *   <StatusBar.Item>5 items</StatusBar.Item>
 *   <StatusBar.Item>2 selected</StatusBar.Item>
 *   <StatusBar.Divider />
 *   <StatusBar.Item align="right">Ready</StatusBar.Item>
 * </StatusBar>
 * ```
 */
export function StatusBar({ children, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        'flex items-center h-6 px-3',
        'bg-win-bg-secondary dark:bg-win-dark-bg-secondary',
        'text-xs text-win-text-secondary dark:text-win-dark-text-secondary',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface StatusBarItemProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * Individual status bar item.
 */
function StatusBarItem({ children, align = 'left', className }: StatusBarItemProps) {
  return (
    <span
      className={cn(
        'truncate',
        align === 'right' && 'ml-auto',
        className
      )}
    >
      {children}
    </span>
  );
}

export interface StatusBarDividerProps {
  className?: string;
}

/**
 * Vertical divider for separating status bar items.
 */
function StatusBarDivider({ className }: StatusBarDividerProps) {
  return (
    <span
      className={cn(
        'mx-2 text-win-border dark:text-win-dark-border',
        className
      )}
    >
      |
    </span>
  );
}

// Attach sub-components
StatusBar.Item = StatusBarItem;
StatusBar.Divider = StatusBarDivider;

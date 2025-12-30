'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WindowContentProps {
  children: ReactNode;
  className?: string;
}

export function WindowContent({ children, className }: WindowContentProps) {
  return (
    <div
      className={cn(
        'flex-1 overflow-auto',
        'bg-win-bg-secondary dark:bg-win-dark-bg-secondary',
        className
      )}
    >
      {children}
    </div>
  );
}

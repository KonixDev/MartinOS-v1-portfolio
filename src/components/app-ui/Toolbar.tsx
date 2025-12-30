'use client';

import { cn } from '@/lib/utils';

export interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Toolbar container component.
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <ToolbarButton icon={<SaveIcon />} label="Save" onClick={handleSave} />
 *   <ToolbarDivider />
 *   <ToolbarButton icon={<UndoIcon />} onClick={handleUndo} disabled />
 * </Toolbar>
 * ```
 */
export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1.5',
        'bg-win-bg-secondary dark:bg-win-dark-bg-secondary',
        className
      )}
    >
      {children}
    </div>
  );
}

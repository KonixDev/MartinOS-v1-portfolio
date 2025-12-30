'use client';

import { cn } from '@/lib/utils';
import { WindowControls } from './WindowControls';

interface WindowTitleBarProps {
  title: string;
  icon?: string;
  isMaximized: boolean;
  isFocused: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onDoubleClick: () => void;
}

export function WindowTitleBar({
  title,
  icon,
  isMaximized,
  isFocused,
  onMinimize,
  onMaximize,
  onClose,
  onDoubleClick,
}: WindowTitleBarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between h-8 select-none',
        'bg-win-bg-secondary dark:bg-win-dark-bg-secondary',
        !isMaximized && 'rounded-t-lg',
        !isFocused && 'opacity-80'
      )}
      onDoubleClick={onDoubleClick}
    >
      {/* Left side - Icon and Title */}
      <div className="flex items-center gap-2 px-3 flex-1 min-w-0">
        {icon && (
          <img
            src={icon}
            alt=""
            className="w-4 h-4 flex-shrink-0"
            draggable={false}
          />
        )}
        <span
          className={cn(
            'text-xs truncate',
            isFocused
              ? 'text-win-text-primary dark:text-win-dark-text-primary'
              : 'text-win-text-secondary dark:text-win-dark-text-secondary'
          )}
        >
          {title}
        </span>
      </div>

      {/* Right side - Window Controls */}
      <WindowControls
        isMaximized={isMaximized}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    </div>
  );
}

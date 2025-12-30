'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { WindowControls } from './WindowControls';

interface WindowTitleBarProps {
  title: string;
  icon?: string | ReactNode;
  isMaximized: boolean;
  isFocused: boolean;
  isMobile?: boolean;
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
  isMobile = false,
  onMinimize,
  onMaximize,
  onClose,
  onDoubleClick,
}: WindowTitleBarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between select-none',
        'bg-win-bg-secondary dark:bg-win-dark-bg-secondary',
        // Taller title bar on mobile for better touch targets
        isMobile ? 'h-11' : 'h-8',
        !isMaximized && 'rounded-t-lg',
        !isFocused && 'opacity-80'
      )}
      onDoubleClick={onDoubleClick}
    >
      {/* Left side - Icon and Title */}
      <div className="flex items-center gap-2 px-3 flex-1 min-w-0">
        {icon && (
          <div className={cn(
            'shrink-0 flex items-center justify-center',
            isMobile ? 'w-5 h-5' : 'w-4 h-4'
          )}>
            {typeof icon === 'string' ? (
              <img
                src={icon}
                alt=""
                className={isMobile ? 'w-5 h-5' : 'w-4 h-4'}
                draggable={false}
              />
            ) : (
              icon
            )}
          </div>
        )}
        <span
          className={cn(
            'truncate',
            isMobile ? 'text-sm' : 'text-xs',
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
        isMobile={isMobile}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    </div>
  );
}

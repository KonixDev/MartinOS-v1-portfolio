'use client';

import { Minus, Square, X, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowControlsProps {
  isMaximized: boolean;
  isMobile?: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function WindowControls({
  isMaximized,
  isMobile = false,
  onMinimize,
  onMaximize,
  onClose,
}: WindowControlsProps) {
  // Larger touch targets for mobile
  const buttonClass = cn(
    'flex items-center justify-center transition-colors duration-100',
    'text-win-text-primary dark:text-win-dark-text-primary',
    'hover:bg-black/5 dark:hover:bg-white/10',
    'active:bg-black/10 dark:active:bg-white/20',
    isMobile ? 'w-12 h-11' : 'w-[46px] h-8'
  );

  const iconSize = isMobile ? 'w-5 h-5' : 'w-4 h-4';
  const smallIconSize = isMobile ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <div className="flex items-center h-full">
      {/* Minimize Button */}
      <button
        onClick={onMinimize}
        className={buttonClass}
        aria-label="Minimize"
      >
        <Minus className={iconSize} strokeWidth={1} />
      </button>

      {/* Maximize/Restore Button */}
      <button
        onClick={onMaximize}
        className={buttonClass}
        aria-label={isMaximized ? 'Restore' : 'Maximize'}
      >
        {isMaximized ? (
          <Copy className={cn(smallIconSize, 'rotate-180')} strokeWidth={1.5} />
        ) : (
          <Square className={smallIconSize} strokeWidth={1.5} />
        )}
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className={cn(
          buttonClass,
          'hover:bg-[#c42b1c]! hover:text-white!',
          'active:bg-[#b22a1c]!',
          !isMaximized && 'rounded-tr-lg'
        )}
        aria-label="Close"
      >
        <X className={iconSize} strokeWidth={1.5} />
      </button>
    </div>
  );
}

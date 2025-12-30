'use client';

import { Minus, Square, X, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowControlsProps {
  isMaximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function WindowControls({
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
}: WindowControlsProps) {
  return (
    <div className="flex items-center h-full">
      {/* Minimize Button */}
      <button
        onClick={onMinimize}
        className={cn(
          'window-control',
          'text-win-text-primary dark:text-win-dark-text-primary',
          'hover:bg-black/5 dark:hover:bg-white/10'
        )}
        aria-label="Minimize"
      >
        <Minus className="w-4 h-4" strokeWidth={1} />
      </button>

      {/* Maximize/Restore Button */}
      <button
        onClick={onMaximize}
        className={cn(
          'window-control',
          'text-win-text-primary dark:text-win-dark-text-primary',
          'hover:bg-black/5 dark:hover:bg-white/10'
        )}
        aria-label={isMaximized ? 'Restore' : 'Maximize'}
      >
        {isMaximized ? (
          <Copy className="w-3.5 h-3.5 rotate-180" strokeWidth={1.5} />
        ) : (
          <Square className="w-3 h-3" strokeWidth={1.5} />
        )}
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className={cn(
          'window-control window-control-close',
          'text-win-text-primary dark:text-win-dark-text-primary',
          'rounded-tr-lg'
        )}
        aria-label="Close"
      >
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

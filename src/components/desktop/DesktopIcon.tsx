'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
}

export function DesktopIcon({
  id,
  name,
  icon,
  isSelected = false,
  onSelect,
  onDoubleClick,
}: DesktopIconProps) {
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onDoubleClick?.(id);
    } else {
      // Single click - wait for potential double click
      onSelect?.(id);
      const timeout = setTimeout(() => {
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  }, [id, clickTimeout, onSelect, onDoubleClick]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-md w-20',
        'transition-colors duration-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        isSelected
          ? 'bg-white/30 border border-white/40'
          : 'hover:bg-white/20 border border-transparent'
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center">
        {typeof icon === 'string' ? (
          <img
            src={icon}
            alt=""
            className="w-10 h-10 object-contain"
            draggable={false}
          />
        ) : (
          icon
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          'text-xs text-center text-white leading-tight',
          'max-w-full px-1 py-0.5 rounded',
          'desktop-icon-text',
          'line-clamp-2'
        )}
      >
        {name}
      </span>
    </button>
  );
}

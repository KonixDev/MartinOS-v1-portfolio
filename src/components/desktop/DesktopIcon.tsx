'use client';

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  x: number;
  y: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

export function DesktopIcon({
  id,
  name,
  icon,
  x,
  y,
  isSelected = false,
  onSelect,
  onDoubleClick,
  onDragEnd,
}: DesktopIconProps) {
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x, y });
  const iconRef = useRef<HTMLButtonElement>(null);
  const hasMoved = useRef(false);

  const handleClick = useCallback(() => {
    // Don't trigger click if we just finished dragging
    if (hasMoved.current) {
      hasMoved.current = false;
      return;
    }

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click

      onSelect?.(id);

      const rect = iconRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      hasMoved.current = false;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        hasMoved.current = true;
        const parentRect = iconRef.current?.parentElement?.getBoundingClientRect();
        if (!parentRect) return;

        const newX = moveEvent.clientX - parentRect.left - dragOffset.x;
        const newY = moveEvent.clientY - parentRect.top - dragOffset.y;

        // Clamp to parent bounds
        const clampedX = Math.max(0, Math.min(newX, parentRect.width - 80));
        const clampedY = Math.max(0, Math.min(newY, parentRect.height - 100));

        setCurrentPos({ x: clampedX, y: clampedY });
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setIsDragging(false);

        if (hasMoved.current) {
          const parentRect = iconRef.current?.parentElement?.getBoundingClientRect();
          if (!parentRect) return;

          const finalX = upEvent.clientX - parentRect.left - dragOffset.x;
          const finalY = upEvent.clientY - parentRect.top - dragOffset.y;

          // Clamp to parent bounds
          const clampedX = Math.max(0, Math.min(finalX, parentRect.width - 80));
          const clampedY = Math.max(0, Math.min(finalY, parentRect.height - 100));

          onDragEnd?.(id, clampedX, clampedY);
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, dragOffset, onSelect, onDragEnd]
  );

  // Sync position from props when not dragging
  const displayPos = isDragging ? currentPos : { x, y };

  return (
    <button
      ref={iconRef}
      data-desktop-icon
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: displayPos.x,
        top: displayPos.y,
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-md w-20',
        'transition-colors duration-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        isSelected
          ? 'bg-white/30 border border-white/40'
          : 'hover:bg-white/20 border border-transparent',
        isDragging && 'opacity-80 z-50'
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

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  x: number;
  y: number;
  isSelected?: boolean;
  onSelect?: (id: string, ctrlKey?: boolean) => void;
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
  const [currentPos, setCurrentPos] = useState({ x, y });
  const iconRef = useRef<HTMLButtonElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const isDraggingRef = useRef(false);

  // Sync position from props when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setCurrentPos({ x, y });
    }
  }, [x, y]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // Don't trigger click if we just finished dragging
      if (hasMovedRef.current) {
        hasMovedRef.current = false;
        return;
      }

      if (clickTimeout) {
        // Double click detected
        clearTimeout(clickTimeout);
        setClickTimeout(null);
        onDoubleClick?.(id);
      } else {
        // Single click - wait for potential double click
        onSelect?.(id, e.ctrlKey || e.metaKey);
        const timeout = setTimeout(() => {
          setClickTimeout(null);
        }, 300);
        setClickTimeout(timeout);
      }
    },
    [id, clickTimeout, onSelect, onDoubleClick]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      e.stopPropagation();

      onSelect?.(id, e.ctrlKey || e.metaKey);

      const rect = iconRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Store offset in ref (immediate update)
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      isDraggingRef.current = true;
      setIsDragging(true);
      hasMovedRef.current = false;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const parentRect = iconRef.current?.parentElement?.getBoundingClientRect();
        if (!parentRect) return;

        hasMovedRef.current = true;

        const newX = moveEvent.clientX - parentRect.left - dragOffsetRef.current.x;
        const newY = moveEvent.clientY - parentRect.top - dragOffsetRef.current.y;

        // Clamp to parent bounds
        const clampedX = Math.max(0, Math.min(newX, parentRect.width - 80));
        const clampedY = Math.max(0, Math.min(newY, parentRect.height - 100));

        setCurrentPos({ x: clampedX, y: clampedY });
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        isDraggingRef.current = false;
        setIsDragging(false);

        if (hasMovedRef.current) {
          const parentRect = iconRef.current?.parentElement?.getBoundingClientRect();
          if (!parentRect) return;

          const finalX = upEvent.clientX - parentRect.left - dragOffsetRef.current.x;
          const finalY = upEvent.clientY - parentRect.top - dragOffsetRef.current.y;

          // Clamp to parent bounds
          const clampedX = Math.max(0, Math.min(finalX, parentRect.width - 80));
          const clampedY = Math.max(0, Math.min(finalY, parentRect.height - 100));

          onDragEnd?.(id, clampedX, clampedY);
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, onSelect, onDragEnd]
  );

  return (
    <button
      ref={iconRef}
      data-desktop-icon
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: currentPos.x,
        top: currentPos.y,
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded w-20',
        'transition-colors duration-75',
        'focus:outline-none',
        isSelected
          ? 'bg-white/20'
          : 'hover:bg-white/10',
        isDragging && 'opacity-70 z-50'
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

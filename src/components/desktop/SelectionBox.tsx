'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface SelectionBoxProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelectionChange: (rect: DOMRect | null) => void;
  onSelectionEnd: () => void;
  disabled?: boolean;
}

export function SelectionBox({
  containerRef,
  onSelectionChange,
  onSelectionEnd,
  disabled = false,
}: SelectionBoxProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (disabled) return;
      if (e.button !== 0) return; // Only left click

      // Check if clicking on a desktop icon
      const target = e.target as HTMLElement;
      if (target.closest('[data-desktop-icon]')) {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      startPosRef.current = { x, y };
      setIsSelecting(true);
      setSelectionRect({ startX: x, startY: y, endX: x, endY: y });
    },
    [containerRef, disabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

      const newRect = {
        startX: startPosRef.current.x,
        startY: startPosRef.current.y,
        endX: x,
        endY: y,
      };

      setSelectionRect(newRect);

      // Calculate actual rectangle bounds
      const left = Math.min(newRect.startX, newRect.endX);
      const top = Math.min(newRect.startY, newRect.endY);
      const width = Math.abs(newRect.endX - newRect.startX);
      const height = Math.abs(newRect.endY - newRect.startY);

      // Only trigger selection if the area is meaningful
      if (width > 5 && height > 5) {
        const selectionDomRect = new DOMRect(left, top, width, height);
        onSelectionChange(selectionDomRect);
      }
    },
    [isSelecting, containerRef, onSelectionChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionRect(null);
      onSelectionEnd();
    }
  }, [isSelecting, onSelectionEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef, handleMouseDown, handleMouseMove, handleMouseUp]);

  if (!isSelecting || !selectionRect) return null;

  const left = Math.min(selectionRect.startX, selectionRect.endX);
  const top = Math.min(selectionRect.startY, selectionRect.endY);
  const width = Math.abs(selectionRect.endX - selectionRect.startX);
  const height = Math.abs(selectionRect.endY - selectionRect.startY);

  // Don't render if too small
  if (width < 5 || height < 5) return null;

  return (
    <div
      className={cn(
        'absolute pointer-events-none',
        'border border-win-accent',
        'bg-win-accent/20'
      )}
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
}

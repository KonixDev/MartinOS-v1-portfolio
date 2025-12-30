'use client';

import { useCallback, useRef, useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { FileSystemItem, DragData, DropData } from '@/types';
import { FILE_ICONS } from '@/constants/icons';

interface DesktopFileIconProps {
  item: FileSystemItem;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: (path: string, ctrlKey?: boolean) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onContextMenu?: (e: React.MouseEvent, item: FileSystemItem) => void;
}

function getFileIconPath(item: FileSystemItem): string {
  if (item.type === 'folder') {
    return FILE_ICONS.folder;
  }

  const extension = item.name.split('.').pop()?.toLowerCase() || '';

  switch (extension) {
    case 'txt':
    case 'md':
      return FILE_ICONS.text;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return FILE_ICONS.image;
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return FILE_ICONS.audio;
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
      return FILE_ICONS.video;
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'css':
    case 'html':
    case 'json':
      return FILE_ICONS.code;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return FILE_ICONS.archive;
    case 'pdf':
      return FILE_ICONS.pdf;
    default:
      return FILE_ICONS.file;
  }
}

export function DesktopFileIcon({
  item,
  x,
  y,
  isSelected,
  onSelect,
  onDoubleClick,
  onContextMenu,
}: DesktopFileIconProps) {
  const iconRef = useRef<HTMLButtonElement>(null);
  const [currentPos, setCurrentPos] = useState({ x, y });

  // Setup draggable with @dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `desktop-file-${item.path}`,
    data: {
      type: item.type,
      items: [item],
      sourcePath: '/Desktop',
      sourceContext: 'desktop',
    } as DragData,
  });

  // Setup droppable for folders
  const {
    setNodeRef: setDropRef,
    isOver,
  } = useDroppable({
    id: `desktop-drop-${item.path}`,
    data: {
      type: 'folder',
      targetPath: item.path,
    } as DropData,
    disabled: item.type !== 'folder',
  });

  // Combine refs
  const combinedRef = useCallback(
    (node: HTMLButtonElement | null) => {
      (iconRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      setDragRef(node);
      if (item.type === 'folder') {
        setDropRef(node);
      }
    },
    [setDragRef, setDropRef, item.type]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(item.path, e.ctrlKey || e.metaKey);
    },
    [item.path, onSelect]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDoubleClick(item);
    },
    [item, onDoubleClick]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Select this item if not already selected
      if (!isSelected) {
        onSelect(item.path);
      }
      onContextMenu?.(e, item);
    },
    [item, isSelected, onSelect, onContextMenu]
  );

  return (
    <button
      ref={combinedRef}
      data-desktop-icon
      style={{
        position: 'absolute',
        left: currentPos.x,
        top: currentPos.y,
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      {...attributes}
      {...listeners}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded w-20',
        'transition-colors duration-75',
        'focus:outline-none touch-none',
        isSelected ? 'bg-white/20' : 'hover:bg-white/10',
        isDragging && 'opacity-50 z-50',
        isOver && item.type === 'folder' && 'ring-2 ring-win-accent bg-win-accent/20'
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center">
        <img
          src={getFileIconPath(item)}
          alt=""
          className="w-10 h-10 object-contain"
          draggable={false}
        />
      </div>

      {/* Label */}
      <span
        className={cn(
          'text-xs text-center text-white leading-tight',
          'line-clamp-2 break-all w-full',
          'text-shadow-sm'
        )}
        style={{
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        {item.name}
      </span>
    </button>
  );
}

'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { FileSystemItem, DragData, DropData } from '@/types';
import { FILE_ICONS } from '@/constants/icons';

interface FileItemProps {
  item: FileSystemItem;
  isSelected: boolean;
  selectedItems: FileSystemItem[];
  currentPath: string;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
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

export function FileItem({
  item,
  isSelected,
  selectedItems,
  currentPath,
  onClick,
  onDoubleClick,
  onContextMenu,
}: FileItemProps) {
  // Determine which items to drag (selected items if current is selected, otherwise just this item)
  const itemsToDrag = isSelected ? selectedItems : [item];

  // Draggable setup
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `drag-${item.path}`,
    data: {
      type: item.type,
      items: itemsToDrag,
      sourcePath: currentPath,
      sourceContext: 'file-explorer',
    } as DragData,
  });

  // Droppable setup (only for folders)
  const {
    setNodeRef: setDropRef,
    isOver,
  } = useDroppable({
    id: `drop-${item.path}`,
    data: {
      type: 'folder',
      targetPath: item.path,
    } as DropData,
    disabled: item.type !== 'folder',
  });

  // Combine refs for folders (both draggable and droppable)
  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    if (item.type === 'folder') {
      setDropRef(node);
    }
  };

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      {...attributes}
      {...listeners}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded',
        'transition-colors duration-100 outline-none',
        'focus:ring-1 focus:ring-win-accent',
        'touch-none', // Prevent touch scrolling during drag
        isSelected
          ? 'bg-win-accent/20'
          : 'hover:bg-black/5 dark:hover:bg-white/10',
        isDragging && 'opacity-50 scale-95',
        isOver && item.type === 'folder' && 'ring-2 ring-win-accent bg-win-accent/10'
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

      {/* Name */}
      <span
        className={cn(
          'text-xs text-center w-full px-1',
          'line-clamp-2 break-all',
          'text-win-text-primary dark:text-win-dark-text-primary',
          isSelected && 'bg-win-accent text-white px-1 rounded'
        )}
      >
        {item.name}
      </span>
    </button>
  );
}

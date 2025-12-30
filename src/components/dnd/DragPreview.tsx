'use client';

import { cn } from '@/lib/utils';
import type { FileSystemItem } from '@/types';
import { FILE_ICONS } from '@/constants/icons';

interface DragPreviewProps {
  items: FileSystemItem[];
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

export function DragPreview({ items }: DragPreviewProps) {
  const firstItem = items[0];
  const count = items.length;

  if (!firstItem) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg',
        'bg-win-window-bg/95 dark:bg-win-dark-window-bg/95',
        'border border-win-accent',
        'shadow-lg backdrop-blur-sm',
        'pointer-events-none'
      )}
    >
      {/* Icon stack for multiple items */}
      <div className="relative">
        <img
          src={getFileIconPath(firstItem)}
          alt=""
          className="w-8 h-8 object-contain"
          draggable={false}
        />
        {count > 1 && (
          <div
            className={cn(
              'absolute -top-1 -right-1',
              'w-5 h-5 rounded-full',
              'bg-win-accent text-white',
              'text-xs font-medium',
              'flex items-center justify-center'
            )}
          >
            {count}
          </div>
        )}
      </div>

      {/* Name */}
      <span className="text-sm text-win-text-primary dark:text-win-dark-text-primary max-w-[150px] truncate">
        {count > 1 ? `${count} items` : firstItem.name}
      </span>
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { FileSystemItem } from '@/types';
import {
  FolderFilled,
  DocumentFilled,
  DocumentTextFilled,
  ImageFilled,
  MusicNote2Filled,
  VideoFilled,
  CodeFilled,
} from '@fluentui/react-icons';

interface FileItemProps {
  item: FileSystemItem;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function getFileIcon(item: FileSystemItem) {
  if (item.type === 'folder') {
    return <FolderFilled className="w-10 h-10" style={{ color: '#FFB900' }} />;
  }

  const extension = item.name.split('.').pop()?.toLowerCase() || '';

  switch (extension) {
    case 'txt':
    case 'md':
      return <DocumentTextFilled className="w-10 h-10" style={{ color: '#0078D4' }} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return <ImageFilled className="w-10 h-10" style={{ color: '#FF8C00' }} />;
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return <MusicNote2Filled className="w-10 h-10" style={{ color: '#E91E63' }} />;
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
      return <VideoFilled className="w-10 h-10" style={{ color: '#9C27B0' }} />;
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'css':
    case 'html':
    case 'json':
      return <CodeFilled className="w-10 h-10" style={{ color: '#4CAF50' }} />;
    default:
      return <DocumentFilled className="w-10 h-10" style={{ color: '#6B6B6B' }} />;
  }
}

export function FileItem({
  item,
  isSelected,
  onClick,
  onDoubleClick,
  onContextMenu,
}: FileItemProps) {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded',
        'transition-colors duration-100 outline-none',
        'focus:ring-1 focus:ring-win-accent',
        isSelected
          ? 'bg-win-accent/20'
          : 'hover:bg-black/5 dark:hover:bg-white/10'
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center">
        {getFileIcon(item)}
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

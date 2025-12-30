'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useFileSystemStore, useWindowStore } from '@/stores';
import { FileSystemItem } from '@/types';
import { FileItem } from './FileItem';

export function FileList() {
  const items = useFileSystemStore((state) => state.items);
  const selectedItems = useFileSystemStore((state) => state.selectedItems);
  const selectItem = useFileSystemStore((state) => state.selectItem);
  const clearSelection = useFileSystemStore((state) => state.clearSelection);
  const navigateTo = useFileSystemStore((state) => state.navigateTo);
  const openFile = useFileSystemStore((state) => state.openFile);
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleClick = useCallback(
    (item: FileSystemItem, e: React.MouseEvent) => {
      e.stopPropagation();
      selectItem(item.path, e.ctrlKey || e.metaKey);
    },
    [selectItem]
  );

  const handleDoubleClick = useCallback(
    async (item: FileSystemItem) => {
      if (item.type === 'folder') {
        navigateTo(item.path);
      } else {
        // Open file based on type
        const extension = item.name.split('.').pop()?.toLowerCase() || '';

        if (['txt', 'md', 'json', 'js', 'ts', 'css', 'html'].includes(extension)) {
          // Open in Notepad
          openWindow('notepad', item.name, {
            width: 650,
            height: 450,
            minWidth: 300,
            minHeight: 200,
            props: { filePath: item.path },
          });
        } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) {
          // Open in Image Viewer
          openWindow('image-viewer', item.name, {
            width: 800,
            height: 600,
            minWidth: 400,
            minHeight: 300,
            props: { filePath: item.path },
          });
        }
      }
    },
    [navigateTo, openWindow]
  );

  const handleContainerClick = () => {
    clearSelection();
  };

  // Sort items: folders first, then files, alphabetically
  const sortedItems = [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-full"
        onClick={handleContainerClick}
      >
        <p className="text-win-text-secondary dark:text-win-dark-text-secondary text-sm">
          This folder is empty
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-full p-2',
        'grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1',
        'content-start'
      )}
      onClick={handleContainerClick}
    >
      {sortedItems.map((item) => (
        <FileItem
          key={item.path}
          item={item}
          isSelected={selectedItems.includes(item.path)}
          onClick={(e) => handleClick(item, e)}
          onDoubleClick={() => handleDoubleClick(item)}
        />
      ))}
    </div>
  );
}

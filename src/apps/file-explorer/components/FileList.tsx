'use client';

import { useCallback, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useContextMenu } from 'react-contexify';
import { cn } from '@/lib/utils';
import { useFileSystemStore, useWindowStore } from '@/stores';
import type { FileSystemItem, DropData } from '@/types';
import { FileItem } from './FileItem';
import { FileContextMenu, FILE_MENU_ID } from '@/components/context-menu/FileContextMenu';
import { FolderContextMenu, FOLDER_MENU_ID } from '@/components/context-menu/FolderContextMenu';
import { deleteItem, renameItem } from '@/lib/filesystem/operations';
import { APP_REGISTRY } from '@/constants/apps';

export function FileList() {
  const items = useFileSystemStore((state) => state.items);
  const selectedItemPaths = useFileSystemStore((state) => state.selectedItems);
  const selectItem = useFileSystemStore((state) => state.selectItem);
  const clearSelection = useFileSystemStore((state) => state.clearSelection);
  const navigateTo = useFileSystemStore((state) => state.navigateTo);
  const currentPath = useFileSystemStore((state) => state.currentPath);
  const refresh = useFileSystemStore((state) => state.refresh);
  const openWindow = useWindowStore((state) => state.openWindow);

  // Context menu hooks
  const { show: showFileMenu } = useContextMenu({ id: FILE_MENU_ID });
  const { show: showFolderMenu } = useContextMenu({ id: FOLDER_MENU_ID });

  // Get selected items as FileSystemItem objects for drag data
  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedItemPaths.includes(item.path));
  }, [items, selectedItemPaths]);

  // Droppable for the current folder (empty space drop)
  const { setNodeRef: setDropRef, isOver: isOverContainer } = useDroppable({
    id: `drop-current-folder-${currentPath}`,
    data: {
      type: 'folder',
      targetPath: currentPath,
    } as DropData,
  });

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

  // Context menu handler for items
  const handleContextMenu = useCallback(
    (item: FileSystemItem, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      selectItem(item.path, false);

      if (item.type === 'folder') {
        showFolderMenu({ event: e, props: { folderId: item.path } });
      } else {
        showFileMenu({ event: e, props: { fileId: item.path } });
      }
    },
    [selectItem, showFileMenu, showFolderMenu]
  );

  // File context menu handlers
  const handleFileOpen = useCallback(
    async (filePath: string) => {
      const item = items.find((i) => i.path === filePath);
      if (item) {
        const extension = item.name.split('.').pop()?.toLowerCase() || '';
        if (['txt', 'md', 'json', 'js', 'ts', 'css', 'html'].includes(extension)) {
          openWindow('notepad', item.name, {
            width: 650,
            height: 450,
            minWidth: 300,
            minHeight: 200,
            props: { filePath: item.path },
          });
        } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) {
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
    [items, openWindow]
  );

  const handleFileDelete = useCallback(
    async (filePath: string) => {
      const item = items.find((i) => i.path === filePath);
      if (item && confirm(`Are you sure you want to delete "${item.name}"?`)) {
        const result = await deleteItem(filePath);
        if (result.success) {
          refresh();
        } else {
          alert(result.error || 'Failed to delete file');
        }
      }
    },
    [items, refresh]
  );

  const handleFileRename = useCallback(
    async (filePath: string) => {
      const item = items.find((i) => i.path === filePath);
      if (item) {
        const newName = prompt('Enter new name:', item.name);
        if (newName && newName !== item.name) {
          const result = await renameItem(filePath, newName);
          if (result.success) {
            refresh();
          } else {
            alert(result.error || 'Failed to rename');
          }
        }
      }
    },
    [items, refresh]
  );

  // Folder context menu handlers
  const handleFolderOpen = useCallback(
    (folderPath: string) => {
      navigateTo(folderPath);
    },
    [navigateTo]
  );

  const handleFolderOpenInNewWindow = useCallback(
    (folderPath: string) => {
      const app = APP_REGISTRY['file-explorer'];
      if (app) {
        openWindow('file-explorer', 'File Explorer', {
          width: app.defaultSize.width,
          height: app.defaultSize.height,
          minWidth: app.minSize.width,
          minHeight: app.minSize.height,
          props: { initialPath: folderPath },
        });
      }
    },
    [openWindow]
  );

  const handleFolderDelete = useCallback(
    async (folderPath: string) => {
      const item = items.find((i) => i.path === folderPath);
      if (item && confirm(`Are you sure you want to delete "${item.name}" and all its contents?`)) {
        const result = await deleteItem(folderPath);
        if (result.success) {
          refresh();
        } else {
          alert(result.error || 'Failed to delete folder');
        }
      }
    },
    [items, refresh]
  );

  const handleFolderRename = useCallback(
    async (folderPath: string) => {
      const item = items.find((i) => i.path === folderPath);
      if (item) {
        const newName = prompt('Enter new name:', item.name);
        if (newName && newName !== item.name) {
          const result = await renameItem(folderPath, newName);
          if (result.success) {
            refresh();
          } else {
            alert(result.error || 'Failed to rename');
          }
        }
      }
    },
    [items, refresh]
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
        ref={setDropRef}
        className={cn(
          'flex items-center justify-center h-full',
          isOverContainer && 'bg-win-accent/10 ring-2 ring-win-accent ring-inset'
        )}
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
      ref={setDropRef}
      className={cn(
        'min-h-full p-2',
        'grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1',
        'content-start',
        isOverContainer && 'bg-win-accent/5'
      )}
      onClick={handleContainerClick}
    >
      {sortedItems.map((item) => (
        <FileItem
          key={item.path}
          item={item}
          isSelected={selectedItemPaths.includes(item.path)}
          selectedItems={selectedItems}
          currentPath={currentPath}
          onClick={(e) => handleClick(item, e)}
          onDoubleClick={() => handleDoubleClick(item)}
          onContextMenu={(e) => handleContextMenu(item, e)}
        />
      ))}

      {/* Context Menus */}
      <FileContextMenu
        onOpen={handleFileOpen}
        onDelete={handleFileDelete}
        onRename={handleFileRename}
      />
      <FolderContextMenu
        onOpen={handleFolderOpen}
        onOpenInNewWindow={handleFolderOpenInNewWindow}
        onDelete={handleFolderDelete}
        onRename={handleFolderRename}
      />
    </div>
  );
}

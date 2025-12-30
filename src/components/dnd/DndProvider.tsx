'use client';

import { ReactNode, useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { moveItem } from '@/lib/filesystem/operations';
import { useFileSystemStore } from '@/stores/fileSystemStore';
import { useDesktopStore } from '@/stores/desktopStore';
import { DragPreview } from './DragPreview';
import type { FileSystemItem, DragData, DropData } from '@/types';

// Path utilities
const joinPath = (...parts: string[]): string => {
  return parts
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '') || '/';
};

interface FileDndProviderProps {
  children: ReactNode;
}

export function FileDndProvider({ children }: FileDndProviderProps) {
  const [activeItems, setActiveItems] = useState<FileSystemItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const refreshFileSystem = useFileSystemStore((state) => state.refresh);
  const refreshDesktop = useDesktopStore((state) => state.refreshDesktopItems);

  // Configure sensors with distance constraint to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const dragData = event.active.data.current as DragData | undefined;
    if (dragData?.items) {
      setActiveItems(dragData.items);
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Can be used for additional visual feedback
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveItems([]);
      setIsDragging(false);

      if (!over) return;

      const dragData = active.data.current as DragData | undefined;
      const dropData = over.data.current as DropData | undefined;

      if (!dragData || !dropData) return;

      // Validate: don't drop on self or into same folder
      const targetPath = dropData.targetPath;

      // Check if trying to drop folder into itself
      for (const item of dragData.items) {
        if (item.path === targetPath) {
          console.warn('Cannot drop item on itself');
          return;
        }
        // Check if trying to drop folder into its own child
        if (item.type === 'folder' && targetPath.startsWith(item.path + '/')) {
          console.warn('Cannot drop folder into its own child');
          return;
        }
        // Skip if already in the target folder
        if (item.parentPath === targetPath) {
          continue;
        }
      }

      // Move each item to the target folder
      let hasChanges = false;
      for (const item of dragData.items) {
        // Skip if already in target
        if (item.parentPath === targetPath) continue;

        const destPath = joinPath(targetPath, item.name);
        const result = await moveItem(item.path, destPath);

        if (result.success) {
          hasChanges = true;
        } else {
          console.error(`Failed to move ${item.name}: ${result.error}`);
        }
      }

      // Refresh both file system and desktop if any changes were made
      if (hasChanges) {
        await Promise.all([
          refreshFileSystem(),
          refreshDesktop(),
        ]);
      }
    },
    [refreshFileSystem, refreshDesktop]
  );

  const handleDragCancel = useCallback(() => {
    setActiveItems([]);
    setIsDragging(false);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {isDragging && activeItems.length > 0 && (
          <DragPreview items={activeItems} />
        )}
      </DragOverlay>
    </DndContext>
  );
}

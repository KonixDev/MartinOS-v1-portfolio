'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useContextMenu } from 'react-contexify';
import { DesktopIcon } from './DesktopIcon';
import { DesktopFileIcon } from './DesktopFileIcon';
import { SelectionBox } from './SelectionBox';
import { useWindowStore } from '@/stores/windowStore';
import { useDesktopStore, GRID_SIZE, ICON_MARGIN } from '@/stores/desktopStore';
import { DESKTOP_APPS, APP_REGISTRY } from '@/constants';
import { DESKTOP_ITEM_MENU_ID } from '@/components/context-menu';
import type { FileSystemItem } from '@/types';

interface DesktopApp {
  id: string;
  appId: string;
  name: string;
  icon: string | React.ReactNode;
}

export function DesktopGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((state) => state.openWindow);
  const {
    iconPositions,
    selectedIconId,
    selectedIconIds,
    desktopItems,
    setIconPosition,
    setSelectedIcon,
    setSelectedIcons,
    toggleSelection,
    clearSelection,
    loadDesktopItems,
  } = useDesktopStore();

  // Context menu for file items
  const { show: showItemMenu } = useContextMenu({
    id: DESKTOP_ITEM_MENU_ID,
  });

  // Load desktop files on mount
  useEffect(() => {
    loadDesktopItems();
  }, [loadDesktopItems]);

  // Create desktop icons from DESKTOP_APPS
  const desktopIcons: DesktopApp[] = DESKTOP_APPS.map((appId) => {
    const app = APP_REGISTRY[appId];
    return {
      id: `desktop-${appId}`,
      appId,
      name: app?.name || appId,
      icon: app?.icon || '📁',
    };
  });

  // Calculate default position for icon (grid layout in column)
  const getDefaultPosition = (index: number) => ({
    x: ICON_MARGIN,
    y: index * GRID_SIZE + ICON_MARGIN,
  });

  // Get position for an icon (from store or default)
  const getIconPosition = (iconId: string, index: number) => {
    const storedPos = iconPositions[iconId];
    if (storedPos) return storedPos;
    return getDefaultPosition(index);
  };

  const handleSelect = useCallback(
    (id: string, ctrlKey?: boolean) => {
      if (ctrlKey) {
        toggleSelection(id);
      } else {
        setSelectedIcon(id);
      }
    },
    [setSelectedIcon, toggleSelection]
  );

  const handleDoubleClick = useCallback(
    (id: string) => {
      const icon = desktopIcons.find((i) => i.id === id);
      if (icon) {
        const app = APP_REGISTRY[icon.appId];
        openWindow(icon.appId, app?.name || icon.appId, {
          width: app?.defaultSize.width || 800,
          height: app?.defaultSize.height || 600,
          minWidth: app?.minSize.width || 400,
          minHeight: app?.minSize.height || 300,
        });
      }
    },
    [desktopIcons, openWindow]
  );

  // Build map of all icon IDs to their default positions
  const getAllIconDefaults = useCallback(() => {
    const defaults: Record<string, { x: number; y: number }> = {};

    // App icons
    desktopIcons.forEach((icon, index) => {
      defaults[icon.id] = getDefaultPosition(index);
    });

    // File icons
    desktopItems.forEach((item, index) => {
      const totalIndex = desktopIcons.length + index;
      defaults[`desktop-file-${item.path}`] = getDefaultPosition(totalIndex);
    });

    return defaults;
  }, [desktopIcons, desktopItems]);

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      setIconPosition(id, x, y, getAllIconDefaults());
    },
    [setIconPosition, getAllIconDefaults]
  );

  // Handle file double click - open with appropriate app
  const handleFileDoubleClick = useCallback(
    (item: FileSystemItem) => {
      if (item.type === 'folder') {
        // Open folder in File Explorer
        const app = APP_REGISTRY['file-explorer'];
        openWindow('file-explorer', item.name, {
          width: app?.defaultSize.width || 900,
          height: app?.defaultSize.height || 600,
          minWidth: app?.minSize.width || 400,
          minHeight: app?.minSize.height || 300,
          props: { initialPath: item.path },
        });
      } else {
        // Open file based on extension
        const extension = item.name.split('.').pop()?.toLowerCase() || '';

        if (extension === 'url' && item.content) {
          window.open(item.content, '_blank', 'noopener,noreferrer');
        } else if (['txt', 'md', 'json', 'js', 'ts', 'css', 'html'].includes(extension)) {
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
    [openWindow]
  );

  // Deselect when clicking outside icons
  const handleDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  // Build map of all icon positions for selection box
  const allIconPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; width: number; height: number }> = {};

    // App icons
    desktopIcons.forEach((icon, index) => {
      const storedPos = iconPositions[icon.id];
      const pos = storedPos || { x: ICON_MARGIN, y: index * GRID_SIZE + ICON_MARGIN };
      positions[icon.id] = { ...pos, width: 80, height: 90 };
    });

    // File icons
    desktopItems.forEach((item, index) => {
      const totalIndex = desktopIcons.length + index;
      const storedPos = iconPositions[`desktop-file-${item.path}`];
      const pos = storedPos || { x: ICON_MARGIN, y: totalIndex * GRID_SIZE + ICON_MARGIN };
      positions[`desktop-file-${item.path}`] = { ...pos, width: 80, height: 90 };
    });

    return positions;
  }, [desktopIcons, desktopItems, iconPositions]);

  // Handle selection box changes
  const handleSelectionChange = useCallback(
    (rect: DOMRect | null) => {
      if (!rect) {
        return;
      }

      // Find all icons that intersect with the selection rectangle
      const selectedIds: string[] = [];

      Object.entries(allIconPositions).forEach(([id, pos]) => {
        // Check if icon intersects with selection rect
        const iconRect = {
          left: pos.x,
          top: pos.y,
          right: pos.x + pos.width,
          bottom: pos.y + pos.height,
        };

        const selRect = {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        };

        // Check intersection
        const intersects =
          iconRect.left < selRect.right &&
          iconRect.right > selRect.left &&
          iconRect.top < selRect.bottom &&
          iconRect.bottom > selRect.top;

        if (intersects) {
          selectedIds.push(id);
        }
      });

      setSelectedIcons(selectedIds);
    },
    [allIconPositions, setSelectedIcons]
  );

  const handleSelectionEnd = useCallback(() => {
    // Selection ended - keep current selection
  }, []);

  // Handle context menu for file icons
  const handleFileContextMenu = useCallback(
    (e: React.MouseEvent, item: FileSystemItem) => {
      // Get all selected desktop file items
      const selectedItems = desktopItems.filter(
        (di) => selectedIconIds.includes(`desktop-file-${di.path}`)
      );

      // If the clicked item is not in the selection, just use the clicked item
      const itemsToShow = selectedItems.length > 0 && selectedIconIds.includes(`desktop-file-${item.path}`)
        ? selectedItems
        : [item];

      showItemMenu({
        event: e,
        props: { items: itemsToShow },
      });
    },
    [desktopItems, selectedIconIds, showItemMenu]
  );

  // Calculate file icon positions (after app icons)
  const getFilePosition = (index: number) => {
    const appCount = desktopIcons.length;
    const totalIndex = appCount + index;
    const storedPos = iconPositions[`desktop-file-${desktopItems[index]?.path}`];
    if (storedPos) return storedPos;
    return getDefaultPosition(totalIndex);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onClick={handleDesktopClick}
    >
      {/* Selection Box */}
      <SelectionBox
        containerRef={containerRef}
        onSelectionChange={handleSelectionChange}
        onSelectionEnd={handleSelectionEnd}
      />

      {/* App Icons */}
      {desktopIcons.map((icon, index) => {
        const pos = getIconPosition(icon.id, index);
        return (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            icon={icon.icon}
            x={pos.x}
            y={pos.y}
            isSelected={selectedIconIds.includes(icon.id)}
            onSelect={handleSelect}
            onDoubleClick={handleDoubleClick}
            onDragEnd={handleDragEnd}
          />
        );
      })}

      {/* File Icons from VFS */}
      {desktopItems.map((item, index) => {
        const pos = getFilePosition(index);
        return (
          <DesktopFileIcon
            key={item.path}
            item={item}
            x={pos.x}
            y={pos.y}
            isSelected={selectedIconIds.includes(`desktop-file-${item.path}`)}
            onSelect={(path, ctrlKey) => handleSelect(`desktop-file-${path}`, ctrlKey)}
            onDoubleClick={handleFileDoubleClick}
            onContextMenu={handleFileContextMenu}
          />
        );
      })}
    </div>
  );
}

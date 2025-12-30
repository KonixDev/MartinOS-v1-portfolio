'use client';

import { useCallback } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { useWindowStore } from '@/stores/windowStore';
import { useDesktopStore, GRID_SIZE, ICON_MARGIN } from '@/stores/desktopStore';
import { DESKTOP_APPS, APP_REGISTRY } from '@/constants';

interface DesktopApp {
  id: string;
  appId: string;
  name: string;
  icon: string | React.ReactNode;
}

export function DesktopGrid() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const {
    iconPositions,
    selectedIconId,
    setIconPosition,
    setSelectedIcon,
  } = useDesktopStore();

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
    (id: string) => {
      setSelectedIcon(id);
    },
    [setSelectedIcon]
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

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      setIconPosition(id, x, y);
    },
    [setIconPosition]
  );

  // Deselect when clicking outside icons
  const handleDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedIcon(null);
      }
    },
    [setSelectedIcon]
  );

  return (
    <div
      className="relative w-full h-full"
      onClick={handleDesktopClick}
    >
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
            isSelected={selectedIconId === icon.id}
            onSelect={handleSelect}
            onDoubleClick={handleDoubleClick}
            onDragEnd={handleDragEnd}
          />
        );
      })}
    </div>
  );
}

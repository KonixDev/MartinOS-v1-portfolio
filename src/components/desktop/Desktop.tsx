'use client';

import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useContextMenu } from 'react-contexify';
import { cn } from '@/lib/utils';
import { TASKBAR_HEIGHT } from '@/constants';
import { DESKTOP_MENU_ID } from '@/components/context-menu';
import { useThemeStore, WALLPAPERS } from '@/stores/themeStore';
import type { DropData } from '@/types';

interface DesktopProps {
  children?: ReactNode;
}

export function Desktop({ children }: DesktopProps) {
  const { show } = useContextMenu({
    id: DESKTOP_MENU_ID,
  });

  // Make desktop a drop target
  const { setNodeRef, isOver } = useDroppable({
    id: 'desktop-drop-zone',
    data: {
      type: 'desktop',
      targetPath: '/Desktop',
    } as DropData,
  });

  const wallpaperId = useThemeStore((state) => state.wallpaper);
  const wallpaperColor = useThemeStore((state) => state.wallpaperColor);

  // Find wallpaper from store
  const selectedWallpaper = WALLPAPERS.find(w => w.id === wallpaperId);

  // Build background style based on selection
  const getBackgroundStyle = () => {
    // Solid color wallpaper
    if (wallpaperId.startsWith('solid-') || !selectedWallpaper?.url) {
      return { backgroundColor: wallpaperColor };
    }
    // Image wallpaper
    if (selectedWallpaper?.url) {
      return { backgroundImage: `url(${selectedWallpaper.url})` };
    }
    // Default gradient
    return { background: 'linear-gradient(135deg, #0078D4 0%, #5C2D91 50%, #D13438 100%)' };
  };

  const backgroundStyle = getBackgroundStyle();

  const handleContextMenu = (event: React.MouseEvent) => {
    // Only show context menu if clicking on the desktop itself
    const target = event.target as HTMLElement;
    if (target.closest('[data-desktop-icon]')) {
      return; // Let the icon handle its own context menu
    }
    show({ event });
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'absolute inset-0 bg-cover bg-center bg-no-repeat',
        'select-none transition-colors duration-200',
        isOver && 'ring-2 ring-inset ring-win-accent/50'
      )}
      style={{
        ...backgroundStyle,
        paddingBottom: TASKBAR_HEIGHT,
      }}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Icons Container */}
      <div className="p-2 h-full">
        {children}
      </div>
    </div>
  );
}

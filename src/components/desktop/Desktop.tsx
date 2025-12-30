'use client';

import { ReactNode } from 'react';
import { useContextMenu } from 'react-contexify';
import { cn } from '@/lib/utils';
import { TASKBAR_HEIGHT } from '@/constants';
import { DESKTOP_MENU_ID } from '@/components/context-menu';

interface DesktopProps {
  wallpaper?: string;
  children?: ReactNode;
}

export function Desktop({ wallpaper, children }: DesktopProps) {
  const { show } = useContextMenu({
    id: DESKTOP_MENU_ID,
  });

  // Default Windows 11 gradient if no wallpaper
  const backgroundStyle = wallpaper
    ? { backgroundImage: `url(${wallpaper})` }
    : { background: 'linear-gradient(135deg, #0078D4 0%, #5C2D91 50%, #D13438 100%)' };

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
      className={cn(
        'absolute inset-0 bg-cover bg-center bg-no-repeat',
        'select-none'
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

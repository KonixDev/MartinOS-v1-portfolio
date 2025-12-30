'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TASKBAR_HEIGHT } from '@/constants';

interface DesktopProps {
  wallpaper?: string;
  children?: ReactNode;
}

export function Desktop({ wallpaper, children }: DesktopProps) {
  // Default Windows 11 gradient if no wallpaper
  const backgroundStyle = wallpaper
    ? { backgroundImage: `url(${wallpaper})` }
    : { background: 'linear-gradient(135deg, #0078D4 0%, #5C2D91 50%, #D13438 100%)' };

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
      onContextMenu={(e) => {
        // TODO: Show desktop context menu
        e.preventDefault();
      }}
    >
      {/* Desktop Icons Container */}
      <div className="p-2 h-full">
        {children}
      </div>
    </div>
  );
}

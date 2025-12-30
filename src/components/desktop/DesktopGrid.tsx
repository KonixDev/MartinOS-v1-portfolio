'use client';

import { useState, useCallback } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { useWindowStore } from '@/stores/windowStore';
import { DESKTOP_APPS, APP_REGISTRY } from '@/constants';

interface DesktopApp {
  id: string;
  appId: string;
  name: string;
  icon: string | React.ReactNode;
}

export function DesktopGrid() {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const openWindow = useWindowStore((state) => state.openWindow);

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

  const handleSelect = useCallback((id: string) => {
    setSelectedIconId(id);
  }, []);

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

  // Deselect when clicking outside icons
  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIconId(null);
    }
  }, []);

  return (
    <div
      className="grid grid-cols-1 gap-1 content-start h-full"
      onClick={handleDesktopClick}
    >
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          name={icon.name}
          icon={icon.icon}
          isSelected={selectedIconId === icon.id}
          onSelect={handleSelect}
          onDoubleClick={handleDoubleClick}
        />
      ))}
    </div>
  );
}

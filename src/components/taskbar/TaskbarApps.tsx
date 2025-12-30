'use client';

import { useMemo } from 'react';
import { TaskbarItem } from './TaskbarItem';
import { useWindowStore } from '@/stores/windowStore';
import { TASKBAR_PINNED, APP_REGISTRY } from '@/constants';

export function TaskbarApps() {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);
  const openWindow = useWindowStore((state) => state.openWindow);

  // Get all apps that should show in taskbar
  const taskbarItems = useMemo(() => {
    const items: Array<{
      appId: string;
      icon: string;
      name: string;
      isPinned: boolean;
      windowIds: string[];
    }> = [];

    // Add pinned apps
    TASKBAR_PINNED.forEach((appId) => {
      const app = APP_REGISTRY[appId];
      if (app) {
        const appWindows = windows.filter((w) => w.appId === appId);
        items.push({
          appId,
          icon: app.icon,
          name: app.name,
          isPinned: true,
          windowIds: appWindows.map((w) => w.id),
        });
      }
    });

    // Add non-pinned open windows
    windows.forEach((window) => {
      if (!TASKBAR_PINNED.includes(window.appId)) {
        const existing = items.find((i) => i.appId === window.appId);
        if (existing) {
          existing.windowIds.push(window.id);
        } else {
          const app = APP_REGISTRY[window.appId];
          items.push({
            appId: window.appId,
            icon: app?.icon || '📁',
            name: app?.name || window.appId,
            isPinned: false,
            windowIds: [window.id],
          });
        }
      }
    });

    return items;
  }, [windows]);

  const handleItemClick = (item: typeof taskbarItems[0]) => {
    if (item.windowIds.length === 0) {
      // No windows open, open a new one
      const app = APP_REGISTRY[item.appId];
      openWindow(item.appId, app?.name || item.appId, {
        width: app?.defaultSize.width || 800,
        height: app?.defaultSize.height || 600,
        minWidth: app?.minSize.width || 400,
        minHeight: app?.minSize.height || 300,
      });
    } else if (item.windowIds.length === 1) {
      const windowId = item.windowIds[0];
      const window = windows.find((w) => w.id === windowId);

      if (window?.isMinimized) {
        restoreWindow(windowId);
      } else if (activeWindowId === windowId) {
        // Already active, minimize it
        useWindowStore.getState().minimizeWindow(windowId);
      } else {
        focusWindow(windowId);
      }
    } else {
      // Multiple windows - focus the first non-minimized or restore the first
      const nonMinimized = item.windowIds.find(
        (id) => !windows.find((w) => w.id === id)?.isMinimized
      );
      if (nonMinimized) {
        focusWindow(nonMinimized);
      } else {
        restoreWindow(item.windowIds[0]);
      }
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {taskbarItems.map((item) => {
        const isOpen = item.windowIds.length > 0;
        const isActive = item.windowIds.includes(activeWindowId || '');

        return (
          <TaskbarItem
            key={item.appId}
            id={item.appId}
            icon={item.icon}
            name={item.name}
            isActive={isActive}
            isOpen={isOpen}
            onClick={() => handleItemClick(item)}
          />
        );
      })}
    </div>
  );
}

'use client';

import { useEffect, useCallback } from 'react';
import { useWindowStore } from '@/stores';

interface KeyboardShortcutsOptions {
  onStartMenu?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const { onStartMenu } = options;

  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  // Minimize all windows (Win + D)
  const minimizeAll = useCallback(() => {
    windows.forEach((window) => {
      if (!window.isMinimized) {
        minimizeWindow(window.id);
      }
    });
  }, [windows, minimizeWindow]);

  // Close active window (Alt + F4)
  const closeActiveWindow = useCallback(() => {
    if (activeWindowId) {
      closeWindow(activeWindowId);
    }
  }, [activeWindowId, closeWindow]);

  // Cycle through windows (Alt + Tab)
  const cycleWindows = useCallback(() => {
    const nonMinimizedWindows = windows.filter((w) => !w.isMinimized);
    if (nonMinimizedWindows.length === 0) return;

    const currentIndex = nonMinimizedWindows.findIndex(
      (w) => w.id === activeWindowId
    );
    const nextIndex = (currentIndex + 1) % nonMinimizedWindows.length;
    focusWindow(nonMinimizedWindows[nextIndex].id);
  }, [windows, activeWindowId, focusWindow]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Windows/Meta key
      if (e.key === 'Meta' || e.key === 'OS') {
        // Just the Windows key - toggle start menu
        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
          // This is handled separately as keyup
        }
      }

      // Win + D - Show desktop (minimize all)
      if ((e.metaKey || e.key === 'Meta') && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        minimizeAll();
        return;
      }

      // Alt + F4 - Close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        closeActiveWindow();
        return;
      }

      // Alt + Tab - Cycle windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        cycleWindows();
        return;
      }

      // Escape - Can be used to close menus, etc.
      if (e.key === 'Escape') {
        // This can be handled by individual components
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Windows/Meta key release - toggle start menu
      if (e.key === 'Meta' || e.key === 'OS') {
        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
          onStartMenu?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [minimizeAll, closeActiveWindow, cycleWindows, onStartMenu]);
}

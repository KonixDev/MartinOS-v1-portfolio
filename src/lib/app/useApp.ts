'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useWindowStore } from '@/stores';
import type { UseAppOptions, UseAppReturn } from './types';

/**
 * Base hook for all apps providing window management functionality.
 *
 * @example
 * ```tsx
 * function MyApp({ windowId }: AppProps) {
 *   const { close, minimize, isFocused, setTitle } = useApp({
 *     windowId,
 *     onMount: () => console.log('App mounted'),
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={close}>Close</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useApp(options: UseAppOptions): UseAppReturn {
  const { windowId, onMount, onUnmount, onFocus, onBlur } = options;

  // Get window state and actions from store
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  // Find our window
  const window = useMemo(
    () => windows.find((w) => w.id === windowId),
    [windows, windowId]
  );

  // Derived state
  const isFocused = activeWindowId === windowId;
  const isMaximized = window?.isMaximized ?? false;
  const isMinimized = window?.isMinimized ?? false;

  // Memoized actions
  const close = useCallback(() => {
    closeWindow(windowId);
  }, [closeWindow, windowId]);

  const minimize = useCallback(() => {
    minimizeWindow(windowId);
  }, [minimizeWindow, windowId]);

  const maximize = useCallback(() => {
    maximizeWindow(windowId);
  }, [maximizeWindow, windowId]);

  const restore = useCallback(() => {
    restoreWindow(windowId);
  }, [restoreWindow, windowId]);

  const focus = useCallback(() => {
    focusWindow(windowId);
  }, [focusWindow, windowId]);

  // Set title - updates window title in store
  const setTitle = useCallback((title: string) => {
    useWindowStore.setState((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, title } : w
      ),
    }));
  }, [windowId]);

  // Mount/unmount lifecycle
  useEffect(() => {
    onMount?.();
    return () => {
      onUnmount?.();
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus/blur callbacks
  useEffect(() => {
    if (isFocused) {
      onFocus?.();
    } else {
      onBlur?.();
    }
  }, [isFocused, onFocus, onBlur]);

  return {
    windowId,
    window,
    isFocused,
    isMaximized,
    isMinimized,
    close,
    minimize,
    maximize,
    restore,
    setTitle,
    focus,
  };
}

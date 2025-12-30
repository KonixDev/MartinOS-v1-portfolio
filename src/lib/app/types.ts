'use client';

import { WindowState } from '@/types';

/**
 * Options for the useApp hook
 */
export interface UseAppOptions {
  /** The window ID for this app instance */
  windowId: string;
  /** Callback when the app mounts */
  onMount?: () => void | Promise<void>;
  /** Callback when the app unmounts */
  onUnmount?: () => void;
  /** Callback when the app gains focus */
  onFocus?: () => void;
  /** Callback when the app loses focus */
  onBlur?: () => void;
}

/**
 * Return type for the useApp hook
 */
export interface UseAppReturn {
  /** The window ID for this app instance */
  windowId: string;
  /** The full window state object */
  window: WindowState | undefined;
  /** Whether this window is currently focused */
  isFocused: boolean;
  /** Whether the window is maximized */
  isMaximized: boolean;
  /** Whether the window is minimized */
  isMinimized: boolean;
  /** Close the window */
  close: () => void;
  /** Minimize the window */
  minimize: () => void;
  /** Maximize the window */
  maximize: () => void;
  /** Restore the window from maximized/minimized */
  restore: () => void;
  /** Update the window title */
  setTitle: (title: string) => void;
  /** Focus this window */
  focus: () => void;
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  /** The key to listen for (e.g., 's', 'F4', 'Escape', 'Enter') */
  key: string;
  /** Whether Ctrl (or Cmd on Mac) must be pressed */
  ctrl?: boolean;
  /** Whether Alt must be pressed */
  alt?: boolean;
  /** Whether Shift must be pressed */
  shift?: boolean;
  /** Whether Meta (Windows/Cmd) must be pressed */
  meta?: boolean;
  /** Handler function when shortcut is triggered */
  handler: (e: KeyboardEvent) => void;
  /** Description for accessibility/help */
  description?: string;
  /** Whether to prevent default browser behavior (default: true) */
  preventDefault?: boolean;
  /** Whether to skip when user is typing in an input (default: true) */
  skipInInput?: boolean;
}

/**
 * Options for the useAppKeyboard hook
 */
export interface UseAppKeyboardOptions {
  /** Array of keyboard shortcuts to register */
  shortcuts: KeyboardShortcut[];
  /** Whether shortcuts are enabled (default: true) */
  enabled?: boolean;
}

/**
 * Options for the useSelection hook
 */
export interface UseSelectionOptions<T> {
  /** Array of items to select from */
  items: T[];
  /** Function to extract unique ID from an item */
  getItemId: (item: T) => string;
  /** Initial selection (array of IDs) */
  initialSelection?: string[];
  /** Whether multi-select is enabled (default: true) */
  multiSelect?: boolean;
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
}

/**
 * Return type for the useSelection hook
 */
export interface UseSelectionReturn<T> {
  /** Array of selected item IDs */
  selectedIds: string[];
  /** Array of selected items */
  selectedItems: T[];
  /** Check if an item is selected */
  isSelected: (id: string) => boolean;
  /** Select an item (additive = Ctrl+Click behavior) */
  select: (id: string, additive?: boolean) => void;
  /** Select a range of items (Shift+Click behavior) */
  selectRange: (id: string) => void;
  /** Toggle selection of an item */
  toggleSelection: (id: string) => void;
  /** Select all items */
  selectAll: () => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** The last selected item ID (for range selection) */
  lastSelectedId: string | null;
}

/**
 * Props for the AppShell component
 */
export interface AppShellProps {
  /** Main content of the app */
  children: React.ReactNode;
  /** Optional toolbar at the top */
  toolbar?: React.ReactNode;
  /** Optional menu bar at the very top */
  menuBar?: React.ReactNode;
  /** Optional sidebar */
  sidebar?: React.ReactNode;
  /** Optional status bar at the bottom */
  statusBar?: React.ReactNode;
  /** Sidebar width (default: 200) */
  sidebarWidth?: number | string;
  /** Sidebar position (default: 'left') */
  sidebarPosition?: 'left' | 'right';
  /** Whether the app is loading */
  isLoading?: boolean;
  /** Loading message to display */
  loadingMessage?: string;
  /** Additional class names for the container */
  className?: string;
  /** Additional class names for the content area */
  contentClassName?: string;
}

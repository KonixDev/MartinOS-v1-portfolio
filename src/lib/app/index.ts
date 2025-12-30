// App Framework - Base hooks and components for MartinOS apps
//
// This module provides abstractions to simplify app development:
// - useApp: Window management (close, minimize, maximize, etc.)
// - useAppKeyboard: Declarative keyboard shortcuts
// - useSelection: Multi-select logic with Ctrl/Shift support
// - AppShell: Standard app layout wrapper

export { useApp } from './useApp';
export { useAppKeyboard, useKeyboardShortcuts } from './useAppKeyboard';
export { useSelection } from './useSelection';
export { AppShell } from './AppShell';

// Re-export types
export type {
  UseAppOptions,
  UseAppReturn,
  KeyboardShortcut,
  UseAppKeyboardOptions,
  UseSelectionOptions,
  UseSelectionReturn,
  AppShellProps,
} from './types';

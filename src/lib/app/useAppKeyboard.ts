'use client';

import { useEffect, useCallback } from 'react';
import type { KeyboardShortcut, UseAppKeyboardOptions } from './types';

/**
 * Hook for declarative keyboard shortcuts with automatic cleanup.
 *
 * @example
 * ```tsx
 * useAppKeyboard({
 *   shortcuts: [
 *     { key: 's', ctrl: true, handler: handleSave, description: 'Save file' },
 *     { key: 'n', ctrl: true, handler: handleNew, description: 'New file' },
 *     { key: 'Escape', handler: handleCancel },
 *   ],
 * });
 * ```
 */
export function useAppKeyboard(options: UseAppKeyboardOptions): void {
  const { shortcuts, enabled = true } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Find matching shortcut
      const matchingShortcut = shortcuts.find((shortcut) => {
        // Check key match (case-insensitive for letters)
        const keyMatch =
          e.key.toLowerCase() === shortcut.key.toLowerCase() ||
          e.code === shortcut.key ||
          e.code === `Key${shortcut.key.toUpperCase()}`;

        if (!keyMatch) return false;

        // Check modifiers
        const ctrlMatch = shortcut.ctrl
          ? e.ctrlKey || e.metaKey // Support Cmd on Mac
          : !e.ctrlKey && !e.metaKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const metaMatch = shortcut.meta ? e.metaKey : true; // Meta is optional

        return ctrlMatch && altMatch && shiftMatch && (shortcut.meta ? metaMatch : true);
      });

      if (!matchingShortcut) return;

      // Skip if user is typing in an input (unless explicitly disabled)
      if (matchingShortcut.skipInInput !== false) {
        const activeElement = document.activeElement;
        const isInputField =
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement ||
          activeElement instanceof HTMLSelectElement ||
          (activeElement as HTMLElement)?.isContentEditable;

        // Allow Escape to work in input fields
        if (isInputField && matchingShortcut.key.toLowerCase() !== 'escape') {
          // Allow Ctrl+S, Ctrl+N, etc. in textareas (common editor shortcuts)
          const isEditorShortcut = matchingShortcut.ctrl &&
            ['s', 'n', 'o', 'z', 'y', 'a'].includes(matchingShortcut.key.toLowerCase());

          if (!isEditorShortcut) {
            return;
          }
        }
      }

      // Prevent default unless explicitly disabled
      if (matchingShortcut.preventDefault !== false) {
        e.preventDefault();
      }

      // Call handler
      matchingShortcut.handler(e);
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Simplified version that accepts just an array of shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  useAppKeyboard({ shortcuts });
}

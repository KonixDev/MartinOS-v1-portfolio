'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { UseSelectionOptions, UseSelectionReturn } from './types';

/**
 * Hook for multi-select logic with Ctrl+Click and Shift+Click support.
 *
 * @example
 * ```tsx
 * const items = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];
 *
 * const {
 *   selectedIds,
 *   isSelected,
 *   select,
 *   selectRange,
 *   clearSelection,
 * } = useSelection({
 *   items,
 *   getItemId: (item) => item.id,
 * });
 *
 * // Handle click with modifiers
 * const handleClick = (id: string, e: React.MouseEvent) => {
 *   if (e.shiftKey) {
 *     selectRange(id);
 *   } else {
 *     select(id, e.ctrlKey || e.metaKey);
 *   }
 * };
 * ```
 */
export function useSelection<T>(
  options: UseSelectionOptions<T>
): UseSelectionReturn<T> {
  const {
    items,
    getItemId,
    initialSelection = [],
    multiSelect = true,
    onSelectionChange,
  } = options;

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelection);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // Create a Set for O(1) lookups
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  // Get selected items
  const selectedItems = useMemo(
    () => items.filter((item) => selectedSet.has(getItemId(item))),
    [items, selectedSet, getItemId]
  );

  // Create index map for range selection
  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item, index) => {
      map.set(getItemId(item), index);
    });
    return map;
  }, [items, getItemId]);

  // Check if an item is selected
  const isSelected = useCallback(
    (id: string): boolean => selectedSet.has(id),
    [selectedSet]
  );

  // Select an item (additive = Ctrl+Click behavior)
  const select = useCallback(
    (id: string, additive = false) => {
      setSelectedIds((prev) => {
        let newSelection: string[];

        if (additive && multiSelect) {
          // Toggle selection if already selected
          if (prev.includes(id)) {
            newSelection = prev.filter((i) => i !== id);
          } else {
            newSelection = [...prev, id];
          }
        } else {
          // Single selection
          newSelection = [id];
        }

        return newSelection;
      });
      setLastSelectedId(id);
    },
    [multiSelect]
  );

  // Select a range of items (Shift+Click behavior)
  const selectRange = useCallback(
    (id: string) => {
      if (!multiSelect) {
        select(id, false);
        return;
      }

      if (!lastSelectedId) {
        select(id, false);
        return;
      }

      const lastIndex = indexMap.get(lastSelectedId);
      const currentIndex = indexMap.get(id);

      if (lastIndex === undefined || currentIndex === undefined) {
        select(id, false);
        return;
      }

      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);

      const rangeIds = items
        .slice(start, end + 1)
        .map((item) => getItemId(item));

      setSelectedIds(rangeIds);
    },
    [items, getItemId, indexMap, lastSelectedId, multiSelect, select]
  );

  // Toggle selection of an item
  const toggleSelection = useCallback(
    (id: string) => {
      select(id, true);
    },
    [select]
  );

  // Select all items
  const selectAll = useCallback(() => {
    if (!multiSelect) return;
    const allIds = items.map((item) => getItemId(item));
    setSelectedIds(allIds);
  }, [items, getItemId, multiSelect]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setLastSelectedId(null);
  }, []);

  // Notify on selection change
  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  // Clear selection when items change significantly
  useEffect(() => {
    // Remove selected IDs that no longer exist in items
    const validIds = items.map((item) => getItemId(item));
    const validSet = new Set(validIds);

    setSelectedIds((prev) => {
      const filtered = prev.filter((id) => validSet.has(id));
      if (filtered.length !== prev.length) {
        return filtered;
      }
      return prev;
    });
  }, [items, getItemId]);

  return {
    selectedIds,
    selectedItems,
    isSelected,
    select,
    selectRange,
    toggleSelection,
    selectAll,
    clearSelection,
    lastSelectedId,
  };
}

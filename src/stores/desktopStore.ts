import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getChildren } from '@/lib/filesystem/operations';
import type { FileSystemItem } from '@/types';

export interface IconPosition {
  id: string;
  x: number;
  y: number;
}

interface DesktopStore {
  iconPositions: Record<string, { x: number; y: number }>;
  selectedIconId: string | null;
  selectedIconIds: string[]; // Multiple selection support
  desktopItems: FileSystemItem[];
  isLoading: boolean;

  // Actions
  setIconPosition: (
    id: string,
    x: number,
    y: number,
    allIconDefaults?: Record<string, { x: number; y: number }>
  ) => void;
  getIconPosition: (id: string) => { x: number; y: number } | undefined;
  setSelectedIcon: (id: string | null) => void;
  setSelectedIcons: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  resetPositions: () => void;
  loadDesktopItems: () => Promise<void>;
  refreshDesktopItems: () => Promise<void>;
}

// Grid settings for snapping
export const GRID_SIZE = 90;
export const ICON_MARGIN = 4;

// Snap position to grid
export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE + ICON_MARGIN;
};

// Convert position to grid cell
export const positionToCell = (x: number, y: number): { col: number; row: number } => {
  return {
    col: Math.round((x - ICON_MARGIN) / GRID_SIZE),
    row: Math.round((y - ICON_MARGIN) / GRID_SIZE),
  };
};

// Convert grid cell to position
export const cellToPosition = (col: number, row: number): { x: number; y: number } => {
  return {
    x: col * GRID_SIZE + ICON_MARGIN,
    y: row * GRID_SIZE + ICON_MARGIN,
  };
};

// Check if two positions are in the same cell
const isSameCell = (pos1: { x: number; y: number }, pos2: { x: number; y: number }): boolean => {
  const cell1 = positionToCell(pos1.x, pos1.y);
  const cell2 = positionToCell(pos2.x, pos2.y);
  return cell1.col === cell2.col && cell1.row === cell2.row;
};

// Find the nearest available grid position
const findAvailablePosition = (
  targetX: number,
  targetY: number,
  occupiedPositions: Array<{ x: number; y: number }>,
  excludeId?: string
): { x: number; y: number } => {
  const targetCell = positionToCell(targetX, targetY);

  // Check if target position is available
  const targetPos = cellToPosition(targetCell.col, targetCell.row);
  const isTargetOccupied = occupiedPositions.some(pos => isSameCell(pos, targetPos));

  if (!isTargetOccupied) {
    return targetPos;
  }

  // Search in expanding spiral pattern for nearest available cell
  const maxSearchRadius = 20;
  for (let radius = 1; radius <= maxSearchRadius; radius++) {
    // Check cells at this radius distance
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        // Only check cells on the perimeter of this radius
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

        const col = targetCell.col + dx;
        const row = targetCell.row + dy;

        // Skip negative positions
        if (col < 0 || row < 0) continue;

        const candidatePos = cellToPosition(col, row);
        const isOccupied = occupiedPositions.some(pos => isSameCell(pos, candidatePos));

        if (!isOccupied) {
          return candidatePos;
        }
      }
    }
  }

  // Fallback: return the snapped target position anyway
  return cellToPosition(targetCell.col, targetCell.row);
};

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      iconPositions: {},
      selectedIconId: null,
      selectedIconIds: [],
      desktopItems: [],
      isLoading: false,

      setIconPosition: (id, x, y, allIconDefaults) => {
        const state = get();
        // Build list of all occupied positions
        const occupiedPositions: Array<{ x: number; y: number }> = [];

        // If defaults are provided, use them for icons without stored positions
        if (allIconDefaults) {
          Object.entries(allIconDefaults).forEach(([iconId, defaultPos]) => {
            if (iconId === id) return; // Skip the icon being moved
            // Use stored position if available, otherwise use default
            const pos = state.iconPositions[iconId] || defaultPos;
            occupiedPositions.push(pos);
          });
        } else {
          // Fallback: only use stored positions
          Object.entries(state.iconPositions)
            .filter(([iconId]) => iconId !== id)
            .forEach(([, pos]) => occupiedPositions.push(pos));
        }

        // Find the nearest available position
        const availablePos = findAvailablePosition(x, y, occupiedPositions, id);

        set((state) => ({
          iconPositions: {
            ...state.iconPositions,
            [id]: availablePos,
          },
        }));
      },

      getIconPosition: (id) => {
        return get().iconPositions[id];
      },

      setSelectedIcon: (id) => {
        set({ selectedIconId: id, selectedIconIds: id ? [id] : [] });
      },

      setSelectedIcons: (ids) => {
        set({
          selectedIconIds: ids,
          selectedIconId: ids.length > 0 ? ids[ids.length - 1] : null,
        });
      },

      addToSelection: (id) => {
        const current = get().selectedIconIds;
        if (!current.includes(id)) {
          set({
            selectedIconIds: [...current, id],
            selectedIconId: id,
          });
        }
      },

      toggleSelection: (id) => {
        const current = get().selectedIconIds;
        if (current.includes(id)) {
          const newSelection = current.filter((i) => i !== id);
          set({
            selectedIconIds: newSelection,
            selectedIconId: newSelection.length > 0 ? newSelection[newSelection.length - 1] : null,
          });
        } else {
          set({
            selectedIconIds: [...current, id],
            selectedIconId: id,
          });
        }
      },

      clearSelection: () => {
        set({ selectedIconId: null, selectedIconIds: [] });
      },

      resetPositions: () => {
        set({ iconPositions: {} });
      },

      loadDesktopItems: async () => {
        set({ isLoading: true });
        try {
          const items = await getChildren('/Desktop');
          set({ desktopItems: items, isLoading: false });
        } catch (error) {
          console.error('Failed to load desktop items:', error);
          set({ desktopItems: [], isLoading: false });
        }
      },

      refreshDesktopItems: async () => {
        try {
          const items = await getChildren('/Desktop');
          set({ desktopItems: items });
        } catch (error) {
          console.error('Failed to refresh desktop items:', error);
        }
      },
    }),
    {
      name: 'desktop-storage',
      partialize: (state) => ({
        iconPositions: state.iconPositions,
      }),
    }
  )
);

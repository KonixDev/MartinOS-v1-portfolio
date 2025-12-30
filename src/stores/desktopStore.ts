import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IconPosition {
  id: string;
  x: number;
  y: number;
}

interface DesktopStore {
  iconPositions: Record<string, { x: number; y: number }>;
  selectedIconId: string | null;

  // Actions
  setIconPosition: (id: string, x: number, y: number) => void;
  getIconPosition: (id: string) => { x: number; y: number } | undefined;
  setSelectedIcon: (id: string | null) => void;
  resetPositions: () => void;
}

// Grid settings for snapping
export const GRID_SIZE = 90;
export const ICON_MARGIN = 4;

// Snap position to grid
export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE + ICON_MARGIN;
};

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      iconPositions: {},
      selectedIconId: null,

      setIconPosition: (id, x, y) => {
        set((state) => ({
          iconPositions: {
            ...state.iconPositions,
            [id]: { x: snapToGrid(x), y: snapToGrid(y) },
          },
        }));
      },

      getIconPosition: (id) => {
        return get().iconPositions[id];
      },

      setSelectedIcon: (id) => {
        set({ selectedIconId: id });
      },

      resetPositions: () => {
        set({ iconPositions: {} });
      },
    }),
    {
      name: 'desktop-storage',
    }
  )
);

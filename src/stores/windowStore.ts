import { create } from 'zustand';
import { WindowState } from '@/types';

// Mobile breakpoint (matches Tailwind's 'md')
const MOBILE_BREAKPOINT = 768;
const TASKBAR_HEIGHT = 48;

interface WindowStore {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;

  // Actions
  openWindow: (appId: string, title: string, config?: Partial<WindowState>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// Check if viewport is mobile
const isMobileViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
};

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (appId, title, config = {}) => {
    const id = generateId();
    const { nextZIndex, windows } = get();

    const isMobile = isMobileViewport();
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight - TASKBAR_HEIGHT : 1080;

    // On mobile, auto-maximize windows
    if (isMobile) {
      const newWindow: WindowState = {
        id,
        appId,
        title,
        x: 0,
        y: 0,
        width: screenWidth,
        height: screenHeight,
        minWidth: config.minWidth ?? 280,
        minHeight: config.minHeight ?? 200,
        isMaximized: true,
        isMinimized: false,
        zIndex: nextZIndex,
        props: config.props,
      };

      set({
        windows: [...windows, newWindow],
        activeWindowId: id,
        nextZIndex: nextZIndex + 1,
      });

      return id;
    }

    // Desktop: Center the window, constrain to viewport
    const defaultWidth = Math.min(config.width ?? 800, screenWidth - 100);
    const defaultHeight = Math.min(config.height ?? 600, screenHeight - 100);
    const x = config.x ?? Math.max(50, (screenWidth - defaultWidth) / 2);
    const y = config.y ?? Math.max(50, (screenHeight - defaultHeight) / 2);

    const newWindow: WindowState = {
      id,
      appId,
      title,
      x,
      y,
      width: defaultWidth,
      height: defaultHeight,
      minWidth: config.minWidth ?? 400,
      minHeight: config.minHeight ?? 300,
      isMaximized: false,
      isMinimized: false,
      zIndex: nextZIndex,
      props: config.props,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    });

    return id;
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true, isMinimized: false } : w
      ),
    }));
  },

  restoreWindow: (id) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: false, isMinimized: false, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
  },

  focusWindow: (id) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  updateWindowSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w
      ),
    }));
  },
}));

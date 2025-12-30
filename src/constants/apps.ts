import { AppConfig } from '@/types';

// Placeholder components - will be replaced with actual implementations
const PlaceholderApp = () => null;

export const APP_REGISTRY: Record<string, AppConfig> = {
  'file-explorer': {
    id: 'file-explorer',
    name: 'File Explorer',
    icon: '/icons/apps/file-explorer.svg',
    component: PlaceholderApp,
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 400, height: 300 },
  },
  'notepad': {
    id: 'notepad',
    name: 'Notepad',
    icon: '/icons/apps/notepad.svg',
    component: PlaceholderApp,
    defaultSize: { width: 650, height: 450 },
    minSize: { width: 300, height: 200 },
  },
  'settings': {
    id: 'settings',
    name: 'Settings',
    icon: '/icons/apps/settings.svg',
    component: PlaceholderApp,
    defaultSize: { width: 1000, height: 700 },
    minSize: { width: 750, height: 500 },
    singleton: true,
  },
  'browser': {
    id: 'browser',
    name: 'Edge',
    icon: '/icons/apps/edge.svg',
    component: PlaceholderApp,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 600, height: 400 },
  },
  'terminal': {
    id: 'terminal',
    name: 'Terminal',
    icon: '/icons/apps/terminal.svg',
    component: PlaceholderApp,
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 400, height: 300 },
  },
  'calculator': {
    id: 'calculator',
    name: 'Calculator',
    icon: '/icons/apps/calculator.svg',
    component: PlaceholderApp,
    defaultSize: { width: 320, height: 500 },
    minSize: { width: 280, height: 400 },
    singleton: true,
  },
  'image-viewer': {
    id: 'image-viewer',
    name: 'Photos',
    icon: '/icons/apps/photos.svg',
    component: PlaceholderApp,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
  },
};

// Apps to show on desktop
export const DESKTOP_APPS = ['file-explorer', 'browser', 'notepad', 'terminal'];

// Apps pinned in Start Menu
export const PINNED_APPS = [
  'browser',
  'file-explorer',
  'settings',
  'notepad',
  'terminal',
  'calculator',
];

// Apps pinned to taskbar
export const TASKBAR_PINNED = ['file-explorer', 'browser', 'terminal'];

// Get app by ID
export const getApp = (appId: string): AppConfig | undefined => {
  return APP_REGISTRY[appId];
};

// Get all apps as array
export const getAllApps = (): AppConfig[] => {
  return Object.values(APP_REGISTRY);
};

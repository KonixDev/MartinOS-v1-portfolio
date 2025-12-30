import { AppConfig } from '@/types';
import {
  FolderFilled,
  DocumentTextFilled,
  SettingsFilled,
  GlobeFilled,
  WindowConsoleFilled,
  CalculatorFilled,
  ImageFilled,
} from '@fluentui/react-icons';
import React from 'react';

// App Components
import { FileExplorer } from '@/apps/file-explorer';
import { Notepad } from '@/apps/notepad';
import { Settings } from '@/apps/settings';
import { Calculator } from '@/apps/calculator';
import { Terminal } from '@/apps/terminal';
import { Browser } from '@/apps/browser';
import { ImageViewer } from '@/apps/image-viewer';

// Helper to create colored icon
const createIcon = (IconComponent: React.ComponentType<{ style?: React.CSSProperties }>, color: string) =>
  React.createElement('div', { style: { color, width: '100%', height: '100%' } },
    React.createElement(IconComponent, { style: { width: '100%', height: '100%' } }));

export const APP_REGISTRY: Record<string, AppConfig> = {
  'file-explorer': {
    id: 'file-explorer',
    name: 'File Explorer',
    icon: createIcon(FolderFilled, '#FFB900'),
    component: FileExplorer,
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 400, height: 300 },
  },
  'notepad': {
    id: 'notepad',
    name: 'Notepad',
    icon: createIcon(DocumentTextFilled, '#0078D4'),
    component: Notepad,
    defaultSize: { width: 650, height: 450 },
    minSize: { width: 300, height: 200 },
  },
  'settings': {
    id: 'settings',
    name: 'Settings',
    icon: createIcon(SettingsFilled, '#6B6B6B'),
    component: Settings,
    defaultSize: { width: 1000, height: 700 },
    minSize: { width: 750, height: 500 },
    singleton: true,
  },
  'browser': {
    id: 'browser',
    name: 'Edge',
    icon: createIcon(GlobeFilled, '#0078D4'),
    component: Browser,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 600, height: 400 },
  },
  'terminal': {
    id: 'terminal',
    name: 'Terminal',
    icon: createIcon(WindowConsoleFilled, '#0C0C0C'),
    component: Terminal,
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 400, height: 300 },
  },
  'calculator': {
    id: 'calculator',
    name: 'Calculator',
    icon: createIcon(CalculatorFilled, '#0078D4'),
    component: Calculator,
    defaultSize: { width: 320, height: 500 },
    minSize: { width: 280, height: 400 },
    singleton: true,
  },
  'image-viewer': {
    id: 'image-viewer',
    name: 'Photos',
    icon: createIcon(ImageFilled, '#FF8C00'),
    component: ImageViewer,
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

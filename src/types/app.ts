import { ComponentType } from 'react';

export interface AppProps {
  windowId: string;
  initialPath?: string;
  props?: Record<string, unknown>;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  component: ComponentType<AppProps>;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  singleton?: boolean;
}

export interface DesktopIcon {
  id: string;
  appId: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  gridPosition?: { col: number; row: number };
}

export interface TaskbarItem {
  id: string;
  appId: string;
  icon: string;
  name: string;
  isPinned: boolean;
  windows: string[];
}

// Window types
export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
}

// App types
export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<AppProps>;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  singleton?: boolean;
}

export interface AppProps {
  windowId: string;
}

// Desktop icon types
export interface DesktopIcon {
  id: string;
  appId: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

// Theme types
export type Theme = 'light' | 'dark';

// System tray types
export interface SystemTrayItem {
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
}

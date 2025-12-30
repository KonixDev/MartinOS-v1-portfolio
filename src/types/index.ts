// Re-export all types
export * from './window';
export * from './file';
export * from './app';
export * from './settings';

// System tray types
export interface SystemTrayItem {
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
}

// Context menu types
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  onClick?: () => void;
}

export interface ContextMenuConfig {
  items: ContextMenuItem[];
}

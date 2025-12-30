'use client';

import { Menu, Item, Separator, Submenu } from 'react-contexify';
import {
  RefreshCw,
  SortAsc,
  Eye,
  Image,
  Monitor,
  Settings,
  Terminal,
  FolderPlus,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWindowStore } from '@/stores/windowStore';
import { APP_REGISTRY } from '@/constants';

import 'react-contexify/ReactContexify.css';

export const DESKTOP_MENU_ID = 'desktop-context-menu';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}

function MenuItem({ icon, label, shortcut }: MenuItemProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <span className="w-4 h-4 text-win-text-secondary dark:text-win-dark-text-secondary">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {shortcut && (
        <span className="text-xs text-win-text-tertiary dark:text-win-dark-text-tertiary ml-6">
          {shortcut}
        </span>
      )}
    </div>
  );
}

export function DesktopContextMenu() {
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDisplaySettings = () => {
    const app = APP_REGISTRY['settings'];
    if (app) openWindow('settings', app.name);
  };

  const handlePersonalize = () => {
    const app = APP_REGISTRY['settings'];
    if (app) openWindow('settings', app.name);
  };

  const handleOpenTerminal = () => {
    const app = APP_REGISTRY['terminal'];
    if (app) openWindow('terminal', app.name);
  };

  return (
    <Menu
      id={DESKTOP_MENU_ID}
      className={cn(
        '!bg-win-surface/95 dark:!bg-win-dark-surface/95',
        '!backdrop-blur-xl',
        '!border !border-win-border dark:!border-win-dark-border',
        '!rounded-lg !shadow-xl',
        '!p-1 !min-w-[200px]'
      )}
      animation="fade"
    >
      {/* View Options */}
      <Submenu
        label={<MenuItem icon={<Eye className="w-4 h-4" />} label="View" />}
        className={cn(
          '!bg-win-surface/95 dark:!bg-win-dark-surface/95',
          '!backdrop-blur-xl',
          '!border !border-win-border dark:!border-win-dark-border',
          '!rounded-lg !shadow-xl'
        )}
      >
        <Item onClick={() => console.log('Large icons')}>
          <MenuItem icon={<span />} label="Large icons" />
        </Item>
        <Item onClick={() => console.log('Medium icons')}>
          <MenuItem icon={<span />} label="Medium icons" />
        </Item>
        <Item onClick={() => console.log('Small icons')}>
          <MenuItem icon={<span />} label="Small icons" />
        </Item>
        <Separator />
        <Item onClick={() => console.log('Auto arrange')}>
          <MenuItem icon={<span />} label="Auto arrange icons" />
        </Item>
        <Item onClick={() => console.log('Align to grid')}>
          <MenuItem icon={<span />} label="Align icons to grid" />
        </Item>
        <Separator />
        <Item onClick={() => console.log('Show desktop icons')}>
          <MenuItem icon={<span />} label="Show desktop icons" />
        </Item>
      </Submenu>

      {/* Sort By */}
      <Submenu
        label={<MenuItem icon={<SortAsc className="w-4 h-4" />} label="Sort by" />}
        className={cn(
          '!bg-win-surface/95 dark:!bg-win-dark-surface/95',
          '!backdrop-blur-xl',
          '!border !border-win-border dark:!border-win-dark-border',
          '!rounded-lg !shadow-xl'
        )}
      >
        <Item onClick={() => console.log('Sort by name')}>
          <MenuItem icon={<span />} label="Name" />
        </Item>
        <Item onClick={() => console.log('Sort by size')}>
          <MenuItem icon={<span />} label="Size" />
        </Item>
        <Item onClick={() => console.log('Sort by type')}>
          <MenuItem icon={<span />} label="Item type" />
        </Item>
        <Item onClick={() => console.log('Sort by date')}>
          <MenuItem icon={<span />} label="Date modified" />
        </Item>
      </Submenu>

      <Item onClick={handleRefresh}>
        <MenuItem icon={<RefreshCw className="w-4 h-4" />} label="Refresh" shortcut="F5" />
      </Item>

      <Separator />

      {/* New */}
      <Submenu
        label={<MenuItem icon={<FolderPlus className="w-4 h-4" />} label="New" />}
        className={cn(
          '!bg-win-surface/95 dark:!bg-win-dark-surface/95',
          '!backdrop-blur-xl',
          '!border !border-win-border dark:!border-win-dark-border',
          '!rounded-lg !shadow-xl'
        )}
      >
        <Item onClick={() => console.log('New folder')}>
          <MenuItem icon={<FolderPlus className="w-4 h-4" />} label="Folder" />
        </Item>
        <Item onClick={() => console.log('New shortcut')}>
          <MenuItem icon={<span />} label="Shortcut" />
        </Item>
        <Separator />
        <Item onClick={() => console.log('New text file')}>
          <MenuItem icon={<FileText className="w-4 h-4" />} label="Text Document" />
        </Item>
      </Submenu>

      <Separator />

      {/* Display Settings */}
      <Item onClick={handleDisplaySettings}>
        <MenuItem icon={<Monitor className="w-4 h-4" />} label="Display settings" />
      </Item>

      {/* Personalize */}
      <Item onClick={handlePersonalize}>
        <MenuItem icon={<Image className="w-4 h-4" />} label="Personalize" />
      </Item>

      <Separator />

      {/* Open Terminal */}
      <Item onClick={handleOpenTerminal}>
        <MenuItem icon={<Terminal className="w-4 h-4" />} label="Open in Terminal" />
      </Item>

      {/* Settings */}
      <Item onClick={handleDisplaySettings}>
        <MenuItem icon={<Settings className="w-4 h-4" />} label="Settings" />
      </Item>
    </Menu>
  );
}

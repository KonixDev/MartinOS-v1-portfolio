'use client';

import { Menu, Item, Separator } from 'react-contexify';
import {
  Copy,
  Scissors,
  Trash2,
  Edit3,
  ExternalLink,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { deleteItem } from '@/lib/filesystem/operations';
import { useDesktopStore } from '@/stores/desktopStore';
import type { FileSystemItem } from '@/types';

import 'react-contexify/ReactContexify.css';

export const DESKTOP_ITEM_MENU_ID = 'desktop-item-context-menu';

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

interface DesktopItemContextMenuProps {
  onOpen?: (items: FileSystemItem[]) => void;
}

export function DesktopItemContextMenu({ onOpen }: DesktopItemContextMenuProps) {
  const { refreshDesktopItems, clearSelection } = useDesktopStore();

  const handleOpen = async ({ props }: { props?: { items: FileSystemItem[] } }) => {
    if (props?.items && props.items.length > 0) {
      onOpen?.(props.items);
    }
  };

  const handleDelete = async ({ props }: { props?: { items: FileSystemItem[] } }) => {
    if (!props?.items || props.items.length === 0) return;

    const itemCount = props.items.length;
    const message = itemCount === 1
      ? `Are you sure you want to delete "${props.items[0].name}"?`
      : `Are you sure you want to delete ${itemCount} items?`;

    if (!confirm(message)) return;

    let hasErrors = false;
    for (const item of props.items) {
      const result = await deleteItem(item.path);
      if (!result.success) {
        console.error(`Failed to delete ${item.name}: ${result.error}`);
        hasErrors = true;
      }
    }

    if (hasErrors) {
      alert('Some items could not be deleted');
    }

    clearSelection();
    await refreshDesktopItems();
  };

  const handleCopy = async ({ props }: { props?: { items: FileSystemItem[] } }) => {
    if (!props?.items || props.items.length === 0) return;

    // Store in clipboard (using localStorage for now)
    const clipboardData = {
      action: 'copy',
      items: props.items.map(item => ({
        path: item.path,
        name: item.name,
        type: item.type,
      })),
    };

    localStorage.setItem('win11-clipboard', JSON.stringify(clipboardData));
  };

  const handleCut = async ({ props }: { props?: { items: FileSystemItem[] } }) => {
    if (!props?.items || props.items.length === 0) return;

    // Store in clipboard with cut action
    const clipboardData = {
      action: 'cut',
      items: props.items.map(item => ({
        path: item.path,
        name: item.name,
        type: item.type,
      })),
    };

    localStorage.setItem('win11-clipboard', JSON.stringify(clipboardData));
  };

  return (
    <Menu
      id={DESKTOP_ITEM_MENU_ID}
      className={cn(
        '!bg-win-surface/95 dark:!bg-win-dark-surface/95',
        '!backdrop-blur-xl',
        '!border !border-win-border dark:!border-win-dark-border',
        '!rounded-lg !shadow-xl',
        '!p-1 !min-w-[200px]'
      )}
      animation="fade"
    >
      {/* Open */}
      <Item onClick={handleOpen}>
        <MenuItem icon={<ExternalLink className="w-4 h-4" />} label="Open" shortcut="Enter" />
      </Item>

      {/* Open folder location (for single item) */}
      <Item onClick={() => console.log('Open folder location')}>
        <MenuItem icon={<FolderOpen className="w-4 h-4" />} label="Open file location" />
      </Item>

      <Separator />

      {/* Cut */}
      <Item onClick={handleCut}>
        <MenuItem icon={<Scissors className="w-4 h-4" />} label="Cut" shortcut="Ctrl+X" />
      </Item>

      {/* Copy */}
      <Item onClick={handleCopy}>
        <MenuItem icon={<Copy className="w-4 h-4" />} label="Copy" shortcut="Ctrl+C" />
      </Item>

      <Separator />

      {/* Rename (only for single item) */}
      <Item onClick={() => console.log('Rename')} disabled>
        <MenuItem icon={<Edit3 className="w-4 h-4" />} label="Rename" shortcut="F2" />
      </Item>

      {/* Delete */}
      <Item onClick={handleDelete}>
        <MenuItem icon={<Trash2 className="w-4 h-4" />} label="Delete" shortcut="Del" />
      </Item>
    </Menu>
  );
}

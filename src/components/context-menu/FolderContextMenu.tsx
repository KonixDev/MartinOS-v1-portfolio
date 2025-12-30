'use client';

import { Menu, Item, Separator, Submenu } from 'react-contexify';
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Edit3,
  Share2,
  ExternalLink,
  Info,
  FolderOpen,
  Terminal,
  Archive,
  Star,
  Pin,
  FolderPlus,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import 'react-contexify/ReactContexify.css';

export const FOLDER_MENU_ID = 'folder-context-menu';

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

interface FolderContextMenuProps {
  onOpen?: (folderId: string) => void;
  onOpenInNewWindow?: (folderId: string) => void;
  onCut?: (folderId: string) => void;
  onCopy?: (folderId: string) => void;
  onPaste?: (folderId: string) => void;
  onDelete?: (folderId: string) => void;
  onRename?: (folderId: string) => void;
  onOpenInTerminal?: (folderId: string) => void;
}

export function FolderContextMenu({
  onOpen,
  onOpenInNewWindow,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onRename,
  onOpenInTerminal,
}: FolderContextMenuProps) {
  const handleOpen = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onOpen?.(props.folderId);
  };

  const handleOpenInNewWindow = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onOpenInNewWindow?.(props.folderId);
  };

  const handleCut = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onCut?.(props.folderId);
  };

  const handleCopy = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onCopy?.(props.folderId);
  };

  const handlePaste = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onPaste?.(props.folderId);
  };

  const handleDelete = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onDelete?.(props.folderId);
  };

  const handleRename = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onRename?.(props.folderId);
  };

  const handleOpenInTerminal = ({ props }: { props?: { folderId: string } }) => {
    if (props?.folderId) onOpenInTerminal?.(props.folderId);
  };

  return (
    <Menu
      id={FOLDER_MENU_ID}
      className={cn(
        '!bg-win-surface/95 dark:!bg-win-dark-surface/95',
        '!backdrop-blur-xl',
        '!border !border-win-border dark:!border-win-dark-border',
        '!rounded-lg !shadow-xl',
        '!p-1 !min-w-[220px]'
      )}
      animation="fade"
    >
      {/* Open */}
      <Item onClick={handleOpen}>
        <MenuItem icon={<FolderOpen className="w-4 h-4" />} label="Open" shortcut="Enter" />
      </Item>

      {/* Open in new window */}
      <Item onClick={handleOpenInNewWindow}>
        <MenuItem icon={<ExternalLink className="w-4 h-4" />} label="Open in new window" />
      </Item>

      {/* Open in Terminal */}
      <Item onClick={handleOpenInTerminal}>
        <MenuItem icon={<Terminal className="w-4 h-4" />} label="Open in Terminal" />
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

      {/* Paste */}
      <Item onClick={handlePaste}>
        <MenuItem icon={<Clipboard className="w-4 h-4" />} label="Paste" shortcut="Ctrl+V" />
      </Item>

      <Separator />

      {/* Pin to Quick Access */}
      <Item onClick={() => console.log('Pin to Quick Access')}>
        <MenuItem icon={<Pin className="w-4 h-4" />} label="Pin to Quick access" />
      </Item>

      {/* Add to favorites */}
      <Item onClick={() => console.log('Add to favorites')}>
        <MenuItem icon={<Star className="w-4 h-4" />} label="Add to favorites" />
      </Item>

      {/* Compress */}
      <Item onClick={() => console.log('Compress')}>
        <MenuItem icon={<Archive className="w-4 h-4" />} label="Compress to ZIP" />
      </Item>

      {/* Share */}
      <Item onClick={() => console.log('Share')}>
        <MenuItem icon={<Share2 className="w-4 h-4" />} label="Share" />
      </Item>

      <Separator />

      {/* New submenu */}
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
        <Separator />
        <Item onClick={() => console.log('New text file')}>
          <MenuItem icon={<FileText className="w-4 h-4" />} label="Text Document" />
        </Item>
      </Submenu>

      <Separator />

      {/* Rename */}
      <Item onClick={handleRename}>
        <MenuItem icon={<Edit3 className="w-4 h-4" />} label="Rename" shortcut="F2" />
      </Item>

      {/* Delete */}
      <Item onClick={handleDelete}>
        <MenuItem icon={<Trash2 className="w-4 h-4" />} label="Delete" shortcut="Del" />
      </Item>

      <Separator />

      {/* Properties */}
      <Item onClick={() => console.log('Properties')}>
        <MenuItem icon={<Info className="w-4 h-4" />} label="Properties" shortcut="Alt+Enter" />
      </Item>
    </Menu>
  );
}

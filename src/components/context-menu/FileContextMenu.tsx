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
  FileText,
  Archive,
  Download,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import 'react-contexify/ReactContexify.css';

export const FILE_MENU_ID = 'file-context-menu';

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

interface FileContextMenuProps {
  onOpen?: (fileId: string) => void;
  onCut?: (fileId: string) => void;
  onCopy?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  onRename?: (fileId: string) => void;
}

export function FileContextMenu({
  onOpen,
  onCut,
  onCopy,
  onDelete,
  onRename,
}: FileContextMenuProps) {
  const handleOpen = ({ props }: { props?: { fileId: string } }) => {
    if (props?.fileId) onOpen?.(props.fileId);
  };

  const handleCut = ({ props }: { props?: { fileId: string } }) => {
    if (props?.fileId) onCut?.(props.fileId);
  };

  const handleCopy = ({ props }: { props?: { fileId: string } }) => {
    if (props?.fileId) onCopy?.(props.fileId);
  };

  const handleDelete = ({ props }: { props?: { fileId: string } }) => {
    if (props?.fileId) onDelete?.(props.fileId);
  };

  const handleRename = ({ props }: { props?: { fileId: string } }) => {
    if (props?.fileId) onRename?.(props.fileId);
  };

  return (
    <Menu
      id={FILE_MENU_ID}
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

      {/* Open With */}
      <Submenu
        label={<MenuItem icon={<FileText className="w-4 h-4" />} label="Open with" />}
        className={cn(
          '!bg-win-surface/95 dark:!bg-win-dark-surface/95',
          '!backdrop-blur-xl',
          '!border !border-win-border dark:!border-win-dark-border',
          '!rounded-lg !shadow-xl'
        )}
      >
        <Item onClick={() => console.log('Open with Notepad')}>
          <MenuItem icon={<span />} label="Notepad" />
        </Item>
        <Item onClick={() => console.log('Choose another app')}>
          <MenuItem icon={<span />} label="Choose another app..." />
        </Item>
      </Submenu>

      <Separator />

      {/* Cut */}
      <Item onClick={handleCut}>
        <MenuItem icon={<Scissors className="w-4 h-4" />} label="Cut" shortcut="Ctrl+X" />
      </Item>

      {/* Copy */}
      <Item onClick={handleCopy}>
        <MenuItem icon={<Copy className="w-4 h-4" />} label="Copy" shortcut="Ctrl+C" />
      </Item>

      {/* Paste (disabled for files) */}
      <Item disabled>
        <MenuItem icon={<Clipboard className="w-4 h-4" />} label="Paste" shortcut="Ctrl+V" />
      </Item>

      <Separator />

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

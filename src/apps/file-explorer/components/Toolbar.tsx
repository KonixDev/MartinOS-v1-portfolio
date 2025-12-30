'use client';

import { cn } from '@/lib/utils';
import { useFileSystemStore } from '@/stores';
import {
  ArrowLeftFilled,
  ArrowRightFilled,
  ArrowUpFilled,
  ArrowClockwiseFilled,
  CutFilled,
  CopyFilled,
  ClipboardPasteFilled,
  RenameFilled,
  DeleteFilled,
  FolderAddFilled,
  DocumentAddFilled,
} from '@fluentui/react-icons';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function ToolbarButton({ icon, label, onClick, disabled }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded',
        'text-xs text-win-text-primary dark:text-win-dark-text-primary',
        'transition-colors duration-100',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-black/5 dark:hover:bg-white/10'
      )}
      title={label}
    >
      <span className="w-4 h-4">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div className="w-px h-5 bg-win-border dark:bg-win-dark-border mx-1" />
  );
}

export function Toolbar() {
  const goBack = useFileSystemStore((state) => state.goBack);
  const goForward = useFileSystemStore((state) => state.goForward);
  const goUp = useFileSystemStore((state) => state.goUp);
  const refresh = useFileSystemStore((state) => state.refresh);
  const history = useFileSystemStore((state) => state.history);
  const historyIndex = useFileSystemStore((state) => state.historyIndex);
  const currentPath = useFileSystemStore((state) => state.currentPath);
  const selectedItems = useFileSystemStore((state) => state.selectedItems);
  const clipboard = useFileSystemStore((state) => state.clipboard);
  const copySelected = useFileSystemStore((state) => state.copySelected);
  const cutSelected = useFileSystemStore((state) => state.cutSelected);
  const paste = useFileSystemStore((state) => state.paste);
  const deleteSelected = useFileSystemStore((state) => state.deleteSelected);
  const createNewFolder = useFileSystemStore((state) => state.createNewFolder);
  const createNewFile = useFileSystemStore((state) => state.createNewFile);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const canGoUp = currentPath !== '/';
  const hasSelection = selectedItems.length > 0;
  const hasClipboard = clipboard !== null;

  const handleNewFolder = async () => {
    const name = prompt('Enter folder name:', 'New Folder');
    if (name) {
      await createNewFolder(name);
    }
  };

  const handleNewFile = async () => {
    const name = prompt('Enter file name:', 'New File.txt');
    if (name) {
      await createNewFile(name);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Delete ${selectedItems.length} item(s)?`)) {
      await deleteSelected();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1',
        'border-b border-win-border dark:border-win-dark-border',
        'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
      )}
    >
      {/* Navigation */}
      <ToolbarButton
        icon={<ArrowLeftFilled className="w-4 h-4" />}
        label="Back"
        onClick={goBack}
        disabled={!canGoBack}
      />
      <ToolbarButton
        icon={<ArrowRightFilled className="w-4 h-4" />}
        label="Forward"
        onClick={goForward}
        disabled={!canGoForward}
      />
      <ToolbarButton
        icon={<ArrowUpFilled className="w-4 h-4" />}
        label="Up"
        onClick={goUp}
        disabled={!canGoUp}
      />
      <ToolbarButton
        icon={<ArrowClockwiseFilled className="w-4 h-4" />}
        label="Refresh"
        onClick={refresh}
      />

      <ToolbarDivider />

      {/* Clipboard */}
      <ToolbarButton
        icon={<CutFilled className="w-4 h-4" />}
        label="Cut"
        onClick={cutSelected}
        disabled={!hasSelection}
      />
      <ToolbarButton
        icon={<CopyFilled className="w-4 h-4" />}
        label="Copy"
        onClick={copySelected}
        disabled={!hasSelection}
      />
      <ToolbarButton
        icon={<ClipboardPasteFilled className="w-4 h-4" />}
        label="Paste"
        onClick={paste}
        disabled={!hasClipboard}
      />

      <ToolbarDivider />

      {/* Create */}
      <ToolbarButton
        icon={<FolderAddFilled className="w-4 h-4" />}
        label="New folder"
        onClick={handleNewFolder}
      />
      <ToolbarButton
        icon={<DocumentAddFilled className="w-4 h-4" />}
        label="New file"
        onClick={handleNewFile}
      />

      <ToolbarDivider />

      {/* Edit */}
      <ToolbarButton
        icon={<DeleteFilled className="w-4 h-4" />}
        label="Delete"
        onClick={handleDelete}
        disabled={!hasSelection}
      />
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useFileSystemStore } from '@/stores';
import { AppProps } from '@/types';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { AddressBar } from './components/AddressBar';
import { FileList } from './components/FileList';

export function FileExplorer({ windowId }: AppProps) {
  const initialize = useFileSystemStore((state) => state.initialize);
  const isInitialized = useFileSystemStore((state) => state.isInitialized);
  const isLoading = useFileSystemStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full bg-win-window-bg dark:bg-win-dark-window-bg">
        <div className="text-win-text-secondary dark:text-win-dark-text-secondary">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', 'bg-win-window-bg dark:bg-win-dark-window-bg')}>
      {/* Toolbar */}
      <Toolbar />

      {/* Address Bar */}
      <AddressBar />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* File list */}
        <div className="flex-1 overflow-auto">
          <FileList />
        </div>
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  );
}

function StatusBar() {
  const items = useFileSystemStore((state) => state.items);
  const selectedItems = useFileSystemStore((state) => state.selectedItems);

  return (
    <div
      className={cn(
        'h-6 px-3 flex items-center gap-4',
        'text-xs text-win-text-secondary dark:text-win-dark-text-secondary',
        'border-t border-win-border dark:border-win-dark-border'
      )}
    >
      <span>{items.length} items</span>
      {selectedItems.length > 0 && (
        <span>{selectedItems.length} selected</span>
      )}
    </div>
  );
}

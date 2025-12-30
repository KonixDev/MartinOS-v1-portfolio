'use client';

import { useState } from 'react';
import { WindowManager } from '@/components/window';
import { Desktop, DesktopGrid } from '@/components/desktop';
import { Taskbar } from '@/components/taskbar';
import { StartMenu } from '@/components/start-menu';
import { DesktopContextMenu } from '@/components/context-menu';
import '@/styles/context-menu.css';

export default function Home() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartClick = () => {
    setIsStartMenuOpen((prev) => !prev);
    if (isStartMenuOpen) {
      setSearchQuery('');
    }
  };

  const handleStartMenuClose = () => {
    setIsStartMenuOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-win-bg-primary dark:bg-win-dark-bg-primary">
      {/* Desktop with Icons */}
      <Desktop>
        <DesktopGrid />
      </Desktop>

      {/* Window Manager */}
      <WindowManager />

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={handleStartMenuClose}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Taskbar */}
      <Taskbar
        onStartClick={handleStartClick}
        isStartMenuOpen={isStartMenuOpen}
      />

      {/* Context Menus */}
      <DesktopContextMenu />
    </div>
  );
}

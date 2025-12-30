'use client';

import { useState, useCallback, useEffect } from 'react';
import { WindowManager } from '@/components/window';
import { Desktop, DesktopGrid } from '@/components/desktop';
import { Taskbar } from '@/components/taskbar';
import { StartMenu } from '@/components/start-menu';
import { DesktopContextMenu, DesktopItemContextMenu } from '@/components/context-menu';
import { BootScreen } from '@/components/boot';
import { FileDndProvider } from '@/components/dnd';
import { useKeyboardShortcuts } from '@/hooks';
import { initializeFileSystem } from '@/lib/filesystem/defaultFiles';
import { useThemeStore, WALLPAPERS } from '@/stores/themeStore';
import '@/styles/context-menu.css';

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wallpaperId = useThemeStore((state) => state.wallpaper);

  // Boot sequence - initialize filesystem and preload assets
  useEffect(() => {
    const boot = async () => {
      try {
        // Initialize filesystem
        await initializeFileSystem();

        // Preload current wallpaper
        const selectedWallpaper = WALLPAPERS.find(w => w.id === wallpaperId);
        if (selectedWallpaper?.url) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Continue even if wallpaper fails
            img.src = selectedWallpaper.url;
          });
        }

        // Small delay for smooth transition
        await new Promise(r => setTimeout(r, 800));
      } catch (error) {
        console.error('Boot error:', error);
      } finally {
        setIsBooting(false);
      }
    };

    boot();
  }, []); // Only run once on mount

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

  const handleStartMenuToggle = useCallback(() => {
    setIsStartMenuOpen((prev) => !prev);
  }, []);

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onStartMenu: handleStartMenuToggle,
  });

  // Show boot screen while loading
  if (isBooting) {
    return <BootScreen />;
  }

  return (
    <FileDndProvider>
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
        <DesktopItemContextMenu />
      </div>
    </FileDndProvider>
  );
}

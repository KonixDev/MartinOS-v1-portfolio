'use client';

import { useState } from 'react';
import { WindowManager } from '@/components/window';
import { Desktop, DesktopGrid } from '@/components/desktop';
import { Taskbar } from '@/components/taskbar';

export default function Home() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const handleStartClick = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-win-bg-primary dark:bg-win-dark-bg-primary">
      {/* Desktop with Icons */}
      <Desktop>
        <DesktopGrid />
      </Desktop>

      {/* Window Manager */}
      <WindowManager />

      {/* Taskbar */}
      <Taskbar
        onStartClick={handleStartClick}
        isStartMenuOpen={isStartMenuOpen}
      />
    </div>
  );
}

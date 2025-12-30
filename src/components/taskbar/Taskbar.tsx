'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { StartButton } from './StartButton';
import { TaskbarApps } from './TaskbarApps';
import { SystemTray } from './SystemTray';
import { Clock } from './Clock';
import { QuickSettings } from './QuickSettings';
import { TASKBAR_HEIGHT } from '@/constants';

interface TaskbarProps {
  onStartClick?: () => void;
  isStartMenuOpen?: boolean;
}

export function Taskbar({ onStartClick, isStartMenuOpen = false }: TaskbarProps) {
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);

  const handleQuickSettingsClick = () => {
    setIsQuickSettingsOpen((prev) => !prev);
  };

  const handleQuickSettingsClose = () => {
    setIsQuickSettingsOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-1000',
          'flex items-center justify-between',
          'acrylic taskbar-shadow',
          'px-2'
        )}
        style={{ height: TASKBAR_HEIGHT }}
      >
        {/* Left Section - Empty for now, could have widgets */}
        <div className="flex-1" />

        {/* Center Section - Start Button + Pinned/Open Apps */}
        <div className="flex items-center gap-1">
          <StartButton onClick={onStartClick} isActive={isStartMenuOpen} />
          <TaskbarApps />
        </div>

        {/* Right Section - System Tray + Clock */}
        <div className="flex-1 flex items-center justify-end gap-1">
          <SystemTray onQuickSettingsClick={handleQuickSettingsClick} />
          <Clock />
        </div>
      </div>

      {/* Quick Settings Panel */}
      <QuickSettings
        isOpen={isQuickSettingsOpen}
        onClose={handleQuickSettingsClose}
      />
    </>
  );
}

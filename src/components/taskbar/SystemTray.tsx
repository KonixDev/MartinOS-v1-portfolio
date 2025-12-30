'use client';

import { Wifi, Volume2, BatteryFull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemTrayProps {
  onQuickSettingsClick?: () => void;
}

export function SystemTray({ onQuickSettingsClick }: SystemTrayProps) {
  return (
    <button
      onClick={onQuickSettingsClick}
      className={cn(
        'flex items-center gap-2 px-2 h-10 rounded-md',
        'transition-colors duration-100',
        'hover:bg-white/10 active:bg-white/20'
      )}
      aria-label="System tray"
    >
      {/* WiFi */}
      <Wifi className="w-4 h-4 text-win-text-primary dark:text-win-dark-text-primary" />

      {/* Volume */}
      <Volume2 className="w-4 h-4 text-win-text-primary dark:text-win-dark-text-primary" />

      {/* Battery */}
      <BatteryFull className="w-4 h-4 text-win-text-primary dark:text-win-dark-text-primary" />
    </button>
  );
}

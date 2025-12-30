'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Plane,
  Moon,
  Sun,
  Battery,
  Volume2,
  VolumeX,
  Settings,
  Accessibility,
  Cast,
  Focus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickSettingButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function QuickSettingButton({
  icon,
  label,
  isActive = false,
  onClick,
}: QuickSettingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 p-3 rounded-md',
        'min-w-[80px] min-h-[70px]',
        'transition-colors duration-100',
        isActive
          ? 'bg-win-accent text-white'
          : 'bg-win-bg-tertiary dark:bg-win-dark-bg-tertiary text-win-text-primary dark:text-win-dark-text-primary hover:bg-win-bg-secondary dark:hover:bg-win-dark-bg-secondary'
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export function QuickSettings({ isOpen, onClose }: QuickSettingsProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState({
    wifi: true,
    bluetooth: false,
    airplane: false,
    nightLight: false,
    focusAssist: false,
    accessibility: false,
  });
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(75);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
          className={cn(
            'absolute bottom-14 right-2',
            'w-[360px]',
            'rounded-lg overflow-hidden',
            'bg-win-mica dark:bg-win-dark-mica',
            'backdrop-blur-2xl',
            'border border-win-border dark:border-win-dark-border',
            'shadow-2xl',
            'z-50',
            'p-4'
          )}
        >
          {/* Quick Settings Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <QuickSettingButton
              icon={settings.wifi ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              label="WiFi"
              isActive={settings.wifi}
              onClick={() => toggleSetting('wifi')}
            />
            <QuickSettingButton
              icon={settings.bluetooth ? <Bluetooth className="w-5 h-5" /> : <BluetoothOff className="w-5 h-5" />}
              label="Bluetooth"
              isActive={settings.bluetooth}
              onClick={() => toggleSetting('bluetooth')}
            />
            <QuickSettingButton
              icon={<Plane className="w-5 h-5" />}
              label="Airplane"
              isActive={settings.airplane}
              onClick={() => toggleSetting('airplane')}
            />
            <QuickSettingButton
              icon={settings.nightLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              label="Night light"
              isActive={settings.nightLight}
              onClick={() => toggleSetting('nightLight')}
            />
            <QuickSettingButton
              icon={<Focus className="w-5 h-5" />}
              label="Focus"
              isActive={settings.focusAssist}
              onClick={() => toggleSetting('focusAssist')}
            />
            <QuickSettingButton
              icon={<Accessibility className="w-5 h-5" />}
              label="Accessibility"
              isActive={settings.accessibility}
              onClick={() => toggleSetting('accessibility')}
            />
            <QuickSettingButton
              icon={<Cast className="w-5 h-5" />}
              label="Cast"
              onClick={() => console.log('Cast clicked')}
            />
            <QuickSettingButton
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              onClick={() => console.log('Settings clicked')}
            />
          </div>

          {/* Brightness Slider */}
          <div className="flex items-center gap-3 mb-3 px-1">
            <Sun className="w-4 h-4 text-win-text-secondary dark:text-win-dark-text-secondary" />
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className={cn(
                'flex-1 h-1 rounded-full appearance-none cursor-pointer',
                'bg-win-border dark:bg-win-dark-border',
                '[&::-webkit-slider-thumb]:appearance-none',
                '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
                '[&::-webkit-slider-thumb]:rounded-full',
                '[&::-webkit-slider-thumb]:bg-win-accent',
                '[&::-webkit-slider-thumb]:shadow-md'
              )}
            />
            <span className="text-xs text-win-text-secondary dark:text-win-dark-text-secondary w-8 text-right">
              {brightness}%
            </span>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 px-1">
            {volume > 0 ? (
              <Volume2 className="w-4 h-4 text-win-text-secondary dark:text-win-dark-text-secondary" />
            ) : (
              <VolumeX className="w-4 h-4 text-win-text-secondary dark:text-win-dark-text-secondary" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={cn(
                'flex-1 h-1 rounded-full appearance-none cursor-pointer',
                'bg-win-border dark:bg-win-dark-border',
                '[&::-webkit-slider-thumb]:appearance-none',
                '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
                '[&::-webkit-slider-thumb]:rounded-full',
                '[&::-webkit-slider-thumb]:bg-win-accent',
                '[&::-webkit-slider-thumb]:shadow-md'
              )}
            />
            <span className="text-xs text-win-text-secondary dark:text-win-dark-text-secondary w-8 text-right">
              {volume}%
            </span>
          </div>

          {/* Battery Status */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-win-border dark:border-win-dark-border">
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-win-text-primary dark:text-win-dark-text-primary" />
              <span className="text-sm text-win-text-primary dark:text-win-dark-text-primary">
                100%
              </span>
            </div>
            <span className="text-xs text-win-text-secondary dark:text-win-dark-text-secondary">
              Plugged in
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

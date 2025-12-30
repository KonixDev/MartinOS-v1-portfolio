'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { PinnedApps } from './PinnedApps';
import { RecommendedSection } from './RecommendedSection';
import { PowerMenu } from './PowerMenu';
import { useWindowStore } from '@/stores/windowStore';
import { APP_REGISTRY } from '@/constants';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function StartMenu({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
}: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((state) => state.openWindow);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Check if click is on the start button (don't close if clicking start button)
        const target = event.target as HTMLElement;
        if (target.closest('[data-start-button]')) {
          return;
        }
        onClose();
      }
    };

    if (isOpen) {
      // Use setTimeout to avoid immediate trigger
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleAppClick = (appId: string) => {
    const app = APP_REGISTRY[appId];
    if (app) {
      openWindow(appId, app.name);
    }
    onClose();
    onSearchChange('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
          className={cn(
            'absolute bottom-14 left-1/2 -translate-x-1/2',
            'w-[640px] max-h-[680px]',
            'rounded-lg overflow-hidden',
            'bg-win-mica dark:bg-win-dark-mica',
            'backdrop-blur-2xl',
            'border border-win-border dark:border-win-dark-border',
            'shadow-2xl',
            'z-50',
            'flex flex-col'
          )}
        >
          {/* Search Bar */}
          <div className="p-4 pb-2">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search for apps, settings, and documents"
            />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
            {/* Pinned Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-medium text-win-text-primary dark:text-win-dark-text-primary">
                  Pinned
                </h3>
                <button
                  className={cn(
                    'text-xs px-2 py-1 rounded',
                    'bg-win-bg-tertiary dark:bg-win-dark-bg-tertiary',
                    'text-win-text-secondary dark:text-win-dark-text-secondary',
                    'hover:bg-win-bg-secondary dark:hover:bg-win-dark-bg-secondary',
                    'transition-colors'
                  )}
                >
                  All apps &gt;
                </button>
              </div>
              <PinnedApps searchQuery={searchQuery} onAppClick={handleAppClick} />
            </div>

            {/* Recommended Section */}
            <RecommendedSection />
          </div>

          {/* Bottom Section - User & Power */}
          <div
            className={cn(
              'flex items-center justify-between px-4 py-3',
              'border-t border-win-border dark:border-win-dark-border',
              'bg-win-bg-secondary/50 dark:bg-win-dark-bg-secondary/50'
            )}
          >
            {/* User Profile */}
            <button
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md',
                'hover:bg-white/10 transition-colors'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full',
                  'bg-win-accent flex items-center justify-center',
                  'text-white text-sm font-medium'
                )}
              >
                M
              </div>
              <span className="text-sm text-win-text-primary dark:text-win-dark-text-primary">
                Martin
              </span>
            </button>

            {/* Power Menu */}
            <PowerMenu />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Power, Moon, RotateCcw, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PowerOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export function PowerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const powerOptions: PowerOption[] = [
    {
      id: 'sleep',
      label: 'Sleep',
      icon: <Moon className="w-4 h-4" />,
      action: () => {
        console.log('Sleep clicked');
        setIsOpen(false);
      },
    },
    {
      id: 'restart',
      label: 'Restart',
      icon: <RotateCcw className="w-4 h-4" />,
      action: () => {
        console.log('Restart clicked');
        window.location.reload();
      },
    },
    {
      id: 'shutdown',
      label: 'Shut down',
      icon: <Power className="w-4 h-4" />,
      action: () => {
        console.log('Shutdown clicked');
        // Could show a "shutting down" animation
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
          document.body.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: #000;
              color: #fff;
              font-family: 'Segoe UI', sans-serif;
            ">
              <p>It's now safe to close this tab.</p>
            </div>
          `;
        }, 1000);
      },
    },
    {
      id: 'signout',
      label: 'Sign out',
      icon: <LogOut className="w-4 h-4" />,
      action: () => {
        console.log('Sign out clicked');
        setIsOpen(false);
      },
    },
  ];

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      {/* Power Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded-md',
          'hover:bg-white/10 transition-colors',
          'text-win-text-primary dark:text-win-dark-text-primary',
          isOpen && 'bg-white/10'
        )}
        aria-label="Power options"
      >
        <Power className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute bottom-full right-0 mb-2',
              'w-48 py-1',
              'rounded-lg overflow-hidden',
              'bg-win-surface/95 dark:bg-win-dark-surface/95',
              'backdrop-blur-xl',
              'border border-win-border dark:border-win-dark-border',
              'shadow-xl'
            )}
          >
            {powerOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.action}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2',
                  'text-sm text-win-text-primary dark:text-win-dark-text-primary',
                  'hover:bg-win-bg-tertiary dark:hover:bg-win-dark-bg-tertiary',
                  'transition-colors'
                )}
              >
                <span className="text-win-text-secondary dark:text-win-dark-text-secondary">
                  {option.icon}
                </span>
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

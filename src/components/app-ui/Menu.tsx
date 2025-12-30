'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Context for menu state
interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within a Menu');
  }
  return context;
}

export interface MenuProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Dropdown menu component.
 *
 * @example
 * ```tsx
 * <Menu>
 *   <MenuButton>File</MenuButton>
 *   <MenuItems>
 *     <MenuItem onClick={handleNew}>New</MenuItem>
 *     <MenuItem onClick={handleSave} shortcut="Ctrl+S">Save</MenuItem>
 *     <MenuDivider />
 *     <MenuItem onClick={handleExit}>Exit</MenuItem>
 *   </MenuItems>
 * </Menu>
 * ```
 */
export function Menu({ children, className }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsOpen(false);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen, closeMenu }}>
      <div ref={menuRef} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

export interface MenuButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Button that triggers the menu dropdown.
 */
export function MenuButton({ children, className }: MenuButtonProps) {
  const { isOpen, setIsOpen } = useMenuContext();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'px-3 py-1 text-sm rounded',
        'text-win-text-primary dark:text-win-dark-text-primary',
        'transition-colors duration-100',
        isOpen
          ? 'bg-win-accent/20'
          : 'hover:bg-black/5 dark:hover:bg-white/10',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface MenuItemsProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * Container for menu items (dropdown panel).
 */
export function MenuItems({ children, align = 'left', className }: MenuItemsProps) {
  const { isOpen } = useMenuContext();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute top-full mt-1 z-50',
        'min-w-[180px] py-1',
        'bg-win-window-bg dark:bg-win-dark-window-bg',
        'border border-win-border dark:border-win-dark-border',
        'rounded-md shadow-lg',
        align === 'left' ? 'left-0' : 'right-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Individual menu item.
 */
export function MenuItem({
  children,
  onClick,
  shortcut,
  disabled = false,
  danger = false,
  icon,
  className,
}: MenuItemProps) {
  const { closeMenu } = useMenuContext();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    closeMenu();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-1.5 text-sm text-left',
        'transition-colors duration-75',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : cn(
              danger
                ? 'text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                : 'text-win-text-primary dark:text-win-dark-text-primary hover:bg-win-accent/10'
            ),
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <span className="w-4 h-4 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="flex-1">{children}</span>

      {/* Shortcut */}
      {shortcut && (
        <span className="text-xs text-win-text-secondary dark:text-win-dark-text-secondary">
          {shortcut}
        </span>
      )}
    </button>
  );
}

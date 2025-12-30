'use client';

import { cn } from '@/lib/utils';

export interface IconButtonProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Tooltip/title text (required for accessibility) */
  title: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in active/pressed state */
  active?: boolean;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button variant */
  variant?: 'default' | 'ghost' | 'solid';
  /** Additional class names */
  className?: string;
}

/**
 * Simple icon-only button component.
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<CloseIcon />}
 *   title="Close"
 *   onClick={handleClose}
 * />
 * ```
 */
export function IconButton({
  icon,
  onClick,
  title,
  disabled = false,
  active = false,
  size = 'md',
  variant = 'default',
  className,
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 [&>svg]:w-3 [&>svg]:h-3',
    md: 'w-8 h-8 [&>svg]:w-4 [&>svg]:h-4',
    lg: 'w-10 h-10 [&>svg]:w-5 [&>svg]:h-5',
  };

  const variantClasses = {
    default: cn(
      active
        ? 'bg-win-accent/20 text-win-accent'
        : 'hover:bg-black/5 dark:hover:bg-white/10',
      'active:bg-black/10 dark:active:bg-white/20'
    ),
    ghost: cn(
      active
        ? 'bg-win-accent/20 text-win-accent'
        : 'hover:bg-black/5 dark:hover:bg-white/5',
      'active:bg-black/10 dark:active:bg-white/10'
    ),
    solid: cn(
      'bg-win-accent text-white',
      'hover:bg-win-accent/90',
      'active:bg-win-accent/80'
    ),
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        'flex items-center justify-center rounded-full',
        'transition-colors duration-100',
        'outline-none focus-visible:ring-2 focus-visible:ring-win-accent',
        'text-win-text-primary dark:text-win-dark-text-primary',
        sizeClasses[size],
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : variantClasses[variant],
        className
      )}
    >
      {icon}
    </button>
  );
}

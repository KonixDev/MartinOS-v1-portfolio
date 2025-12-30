'use client';

import { cn } from '@/lib/utils';

export interface ToolbarButtonProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Optional label text */
  label?: string;
  /** Tooltip text (defaults to label) */
  title?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in active/pressed state */
  active?: boolean;
  /** Button variant */
  variant?: 'default' | 'primary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md';
  /** Additional class names */
  className?: string;
  /** Whether to hide label on small screens */
  hideLabel?: boolean;
}

/**
 * Toolbar button component with icon and optional label.
 *
 * @example
 * ```tsx
 * <ToolbarButton
 *   icon={<ArrowLeftIcon />}
 *   label="Back"
 *   onClick={handleBack}
 *   disabled={!canGoBack}
 * />
 * ```
 */
export function ToolbarButton({
  icon,
  label,
  title,
  onClick,
  disabled = false,
  active = false,
  variant = 'default',
  size = 'md',
  className,
  hideLabel = false,
}: ToolbarButtonProps) {
  const sizeClasses = {
    sm: 'h-7 px-1.5 gap-1 text-xs',
    md: 'h-8 px-2 gap-1.5 text-sm',
  };

  const variantClasses = {
    default: cn(
      active
        ? 'bg-win-accent/20 text-win-accent'
        : 'hover:bg-black/5 dark:hover:bg-white/10',
      'active:bg-black/10 dark:active:bg-white/20'
    ),
    primary: cn(
      'bg-win-accent text-white',
      'hover:bg-win-accent/90',
      'active:bg-win-accent/80'
    ),
    danger: cn(
      'text-red-600 dark:text-red-400',
      'hover:bg-red-100 dark:hover:bg-red-900/30',
      'active:bg-red-200 dark:active:bg-red-900/50'
    ),
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      className={cn(
        'flex items-center justify-center rounded',
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
      {/* Icon */}
      <span className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5', '[&>svg]:w-full [&>svg]:h-full')}>
        {icon}
      </span>

      {/* Label */}
      {label && (
        <span
          className={cn(
            'truncate',
            hideLabel && 'hidden sm:inline'
          )}
        >
          {label}
        </span>
      )}
    </button>
  );
}

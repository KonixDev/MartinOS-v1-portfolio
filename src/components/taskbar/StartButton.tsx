'use client';

import { cn } from '@/lib/utils';

interface StartButtonProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function StartButton({ onClick, isActive = false }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      data-start-button
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-md',
        'transition-colors duration-100',
        isActive
          ? 'bg-white/20'
          : 'hover:bg-white/10 active:bg-white/20'
      )}
      aria-label="Start"
    >
      {/* Windows 11 Logo SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-win-text-primary dark:text-win-dark-text-primary"
      >
        <path
          d="M0 0h9v9H0V0zm11 0h9v9h-9V0zM0 11h9v9H0v-9zm11 0h9v9h-9v-9z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

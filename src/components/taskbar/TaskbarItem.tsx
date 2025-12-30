'use client';

import { cn } from '@/lib/utils';

interface TaskbarItemProps {
  id: string;
  icon: string | React.ReactNode;
  name: string;
  isActive?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

export function TaskbarItem({
  id,
  icon,
  name,
  isActive = false,
  isOpen = false,
  onClick,
}: TaskbarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-10 h-10 flex items-center justify-center rounded-md',
        'transition-colors duration-100',
        isActive
          ? 'bg-white/20'
          : isOpen
          ? 'bg-white/10 hover:bg-white/15'
          : 'hover:bg-white/10 active:bg-white/20'
      )}
      title={name}
      aria-label={name}
    >
      {/* Icon */}
      <div className="w-6 h-6 flex items-center justify-center">
        {typeof icon === 'string' ? (
          icon.startsWith('/') ? (
            <img src={icon} alt="" className="w-5 h-5 object-contain" />
          ) : (
            <span className="text-lg">{icon}</span>
          )
        ) : (
          icon
        )}
      </div>

      {/* Active/Open Indicator */}
      {(isOpen || isActive) && (
        <div
          className={cn(
            'absolute bottom-1 left-1/2 -translate-x-1/2',
            'h-0.5 rounded-full bg-win-accent',
            isActive ? 'w-4' : 'w-1.5'
          )}
        />
      )}
    </button>
  );
}

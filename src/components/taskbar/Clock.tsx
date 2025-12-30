'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatTime, formatDate } from '@/lib/utils';

interface ClockProps {
  onCalendarClick?: () => void;
}

export function Clock({ onCalendarClick }: ClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every second to ensure clock stays accurate
    // The UI only shows minutes, so most updates won't cause re-renders
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onCalendarClick}
      className={cn(
        'flex flex-col items-end justify-center px-3 h-10 rounded-md',
        'transition-colors duration-100',
        'hover:bg-white/10 active:bg-white/20'
      )}
      aria-label="Clock and calendar"
    >
      <span className="text-xs text-win-text-primary dark:text-win-dark-text-primary">
        {formatTime(now)}
      </span>
      <span className="text-xs text-win-text-primary dark:text-win-dark-text-primary">
        {formatDate(now)}
      </span>
    </button>
  );
}

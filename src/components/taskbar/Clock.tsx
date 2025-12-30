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
    // Update every minute
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    // Also update immediately on the next minute boundary
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      setNow(new Date());
    }, msUntilNextMinute);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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

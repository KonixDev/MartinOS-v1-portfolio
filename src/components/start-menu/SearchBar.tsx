'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Type here to search',
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
          'text-win-text-secondary dark:text-win-dark-text-secondary'
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full h-9 pl-10 pr-4 rounded-full',
          'bg-win-bg-tertiary dark:bg-win-dark-bg-tertiary',
          'border border-win-border dark:border-win-dark-border',
          'text-sm text-win-text-primary dark:text-win-dark-text-primary',
          'placeholder:text-win-text-secondary dark:placeholder:text-win-dark-text-secondary',
          'focus:outline-none focus:ring-2 focus:ring-win-accent focus:border-transparent',
          'transition-all duration-150'
        )}
      />
    </div>
  );
}

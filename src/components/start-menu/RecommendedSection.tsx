'use client';

import { cn } from '@/lib/utils';
import { FileText, Image, Folder } from 'lucide-react';

interface RecommendedItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image';
  date: string;
}

const RECOMMENDED_ITEMS: RecommendedItem[] = [
  { id: '1', name: 'Welcome.txt', type: 'file', date: 'Recently' },
  { id: '2', name: 'Documents', type: 'folder', date: 'Recently' },
  { id: '3', name: 'README.md', type: 'file', date: 'Yesterday' },
];

interface RecommendedSectionProps {
  onItemClick?: (item: RecommendedItem) => void;
}

export function RecommendedSection({ onItemClick }: RecommendedSectionProps) {
  const getIcon = (type: RecommendedItem['type']) => {
    switch (type) {
      case 'file':
        return <FileText className="w-5 h-5" />;
      case 'folder':
        return <Folder className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-win-text-primary dark:text-win-dark-text-primary">
          Recommended
        </h3>
        <button
          className={cn(
            'text-xs text-win-text-secondary dark:text-win-dark-text-secondary',
            'hover:text-win-accent transition-colors'
          )}
        >
          More &gt;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1">
        {RECOMMENDED_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className={cn(
              'flex items-center gap-3 p-2 rounded-md',
              'transition-colors duration-100',
              'hover:bg-white/10 active:bg-white/20',
              'text-left'
            )}
          >
            <div className="w-10 h-10 rounded bg-win-accent/20 flex items-center justify-center text-win-accent">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-win-text-primary dark:text-win-dark-text-primary truncate">
                {item.name}
              </p>
              <p className="text-xs text-win-text-secondary dark:text-win-dark-text-secondary">
                {item.date}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

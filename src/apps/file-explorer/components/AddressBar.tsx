'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useFileSystemStore } from '@/stores';
import { FolderFilled, ChevronRightFilled } from '@fluentui/react-icons';

export function AddressBar() {
  const currentPath = useFileSystemStore((state) => state.currentPath);
  const navigateTo = useFileSystemStore((state) => state.navigateTo);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentPath);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(currentPath);
  }, [currentPath]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const pathParts = currentPath.split('/').filter(Boolean);

  const handleBreadcrumbClick = (index: number) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    navigateTo(path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputValue);
    setIsEditing(false);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setInputValue(currentPath);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5',
        'border-b border-win-border dark:border-win-dark-border',
        'bg-white dark:bg-win-dark-bg'
      )}
    >
      {/* Address bar container */}
      <div
        className={cn(
          'flex-1 flex items-center h-7 rounded',
          'border border-win-border dark:border-win-dark-border',
          'bg-win-bg dark:bg-win-dark-bg-secondary',
          isEditing && 'ring-2 ring-win-accent'
        )}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              className={cn(
                'w-full h-full px-2 text-sm',
                'bg-transparent outline-none',
                'text-win-text-primary dark:text-win-dark-text-primary'
              )}
            />
          </form>
        ) : (
          <div className="flex items-center px-2 overflow-hidden">
            {/* Home icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('/');
              }}
              className="flex items-center p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"
            >
              <FolderFilled className="w-4 h-4 text-yellow-500" />
            </button>

            {/* Path breadcrumbs */}
            {pathParts.map((part, index) => (
              <div key={index} className="flex items-center">
                <ChevronRightFilled className="w-3 h-3 mx-0.5 text-win-text-secondary dark:text-win-dark-text-secondary" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBreadcrumbClick(index);
                  }}
                  className={cn(
                    'px-1 py-0.5 rounded text-sm',
                    'text-win-text-primary dark:text-win-dark-text-primary',
                    'hover:bg-black/5 dark:hover:bg-white/10'
                  )}
                >
                  {part}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

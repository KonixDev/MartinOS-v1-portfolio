'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AppProps } from '@/types';
import { useWindowStore } from '@/stores';
import { getItem, updateFileContent, createFile } from '@/lib/filesystem/operations';

export function Notepad({ windowId, props }: AppProps) {
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const windows = useWindowStore((state) => state.windows);
  const closeWindow = useWindowStore((state) => state.closeWindow);

  // Get window title update function
  const currentWindow = windows.find((w) => w.id === windowId);

  // Load file content if filePath is provided
  useEffect(() => {
    const loadFile = async () => {
      const path = props?.filePath as string | undefined;
      if (!path) return;

      setIsLoading(true);
      try {
        const file = await getItem(path);
        if (file && file.type === 'file') {
          setContent(file.content || '');
          setOriginalContent(file.content || '');
          setFilePath(path);
        }
      } catch (error) {
        console.error('Failed to load file:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [props?.filePath]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const hasChanges = content !== originalContent;

  const handleSave = useCallback(async () => {
    if (!filePath) {
      // Prompt for filename if no file is open
      const filename = prompt('Enter filename:', 'untitled.txt');
      if (!filename) return;

      const path = `/Documents/${filename}`;
      const result = await createFile('/Documents', filename, content);

      if (result.success) {
        setFilePath(path);
        setOriginalContent(content);
      } else {
        alert(result.error || 'Failed to save file');
      }
    } else {
      // Save to existing file
      const result = await updateFileContent(filePath, content);
      if (result.success) {
        setOriginalContent(content);
      } else {
        alert('Failed to save file');
      }
    }
  }, [content, filePath]);

  const handleNew = useCallback(() => {
    if (hasChanges) {
      const confirmNew = confirm('You have unsaved changes. Create new file anyway?');
      if (!confirmNew) return;
    }
    setContent('');
    setOriginalContent('');
    setFilePath(null);
  }, [hasChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleNew]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-win-window-bg dark:bg-win-dark-window-bg">
        <span className="text-win-text-secondary dark:text-win-dark-text-secondary">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', 'bg-win-window-bg dark:bg-win-dark-window-bg')}>
      {/* Menu Bar */}
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1',
          'border-b border-win-border dark:border-win-dark-border',
          'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
        )}
      >
        <MenuButton label="File">
          <MenuItem label="New" shortcut="Ctrl+N" onClick={handleNew} />
          <MenuItem label="Save" shortcut="Ctrl+S" onClick={handleSave} />
          <MenuDivider />
          <MenuItem label="Exit" onClick={() => closeWindow(windowId)} />
        </MenuButton>
        <MenuButton label="Edit">
          <MenuItem
            label="Cut"
            shortcut="Ctrl+X"
            onClick={() => document.execCommand('cut')}
          />
          <MenuItem
            label="Copy"
            shortcut="Ctrl+C"
            onClick={() => document.execCommand('copy')}
          />
          <MenuItem
            label="Paste"
            shortcut="Ctrl+V"
            onClick={() => document.execCommand('paste')}
          />
          <MenuDivider />
          <MenuItem
            label="Select All"
            shortcut="Ctrl+A"
            onClick={() => textareaRef.current?.select()}
          />
        </MenuButton>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={cn(
          'flex-1 w-full p-3 resize-none outline-none',
          'font-mono text-sm leading-relaxed',
          'bg-win-window-bg dark:bg-win-dark-window-bg',
          'text-win-text-primary dark:text-win-dark-text-primary',
          'placeholder:text-win-text-secondary dark:placeholder:text-win-dark-text-secondary'
        )}
        placeholder="Start typing..."
        spellCheck={false}
      />

      {/* Status Bar */}
      <div
        className={cn(
          'h-6 px-3 flex items-center justify-between',
          'text-xs text-win-text-secondary dark:text-win-dark-text-secondary',
          'border-t border-win-border dark:border-win-dark-border',
          'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
        )}
      >
        <span>
          {filePath ? filePath : 'Untitled'}
          {hasChanges && ' *'}
        </span>
        <span>
          {content.split('\n').length} lines, {content.length} characters
        </span>
      </div>
    </div>
  );
}

// Menu Components
function MenuButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className={cn(
          'px-2 py-0.5 text-xs rounded',
          'text-win-text-primary dark:text-win-dark-text-primary',
          'hover:bg-black/5 dark:hover:bg-white/10',
          isOpen && 'bg-black/5 dark:bg-white/10'
        )}
      >
        {label}
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-0.5 z-50',
            'min-w-[160px] py-1 rounded-md shadow-lg',
            'bg-win-window-bg dark:bg-win-dark-window-bg',
            'border border-win-border dark:border-win-dark-border'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  label,
  shortcut,
  onClick,
  disabled,
}: {
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center justify-between px-3 py-1 text-xs',
        'text-win-text-primary dark:text-win-dark-text-primary',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-win-accent hover:text-white'
      )}
    >
      <span>{label}</span>
      {shortcut && (
        <span className="text-win-text-secondary dark:text-win-dark-text-secondary ml-4">
          {shortcut}
        </span>
      )}
    </button>
  );
}

function MenuDivider() {
  return <div className="my-1 border-t border-win-border dark:border-win-dark-border" />;
}

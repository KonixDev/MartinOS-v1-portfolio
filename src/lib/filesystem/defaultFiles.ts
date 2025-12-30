import { db } from './index';
import { FileSystemItem } from '@/types';

const createDefaultItem = (
  name: string,
  path: string,
  parentPath: string,
  type: 'file' | 'folder',
  content?: string
): FileSystemItem => {
  const now = new Date();
  return {
    name,
    path,
    parentPath,
    type,
    mimeType: type === 'file' ? 'text/plain' : undefined,
    content,
    size: content ? new Blob([content]).size : 0,
    createdAt: now,
    modifiedAt: now,
  };
};

export const DEFAULT_FOLDERS: FileSystemItem[] = [
  createDefaultItem('Desktop', '/Desktop', '/', 'folder'),
  createDefaultItem('Documents', '/Documents', '/', 'folder'),
  createDefaultItem('Downloads', '/Downloads', '/', 'folder'),
  createDefaultItem('Pictures', '/Pictures', '/', 'folder'),
  createDefaultItem('Music', '/Music', '/', 'folder'),
  createDefaultItem('Videos', '/Videos', '/', 'folder'),
];

export const DEFAULT_FILES: FileSystemItem[] = [
  createDefaultItem(
    'Welcome.txt',
    '/Desktop/Welcome.txt',
    '/Desktop',
    'file',
    `Welcome to Windows 11 Web!

This is a web-based recreation of the Windows 11 desktop experience.

Features:
- Draggable and resizable windows
- Taskbar with pinned apps
- Start menu with search
- File Explorer with virtual filesystem
- Multiple built-in apps

Enjoy exploring!`
  ),
  createDefaultItem(
    'README.md',
    '/Documents/README.md',
    '/Documents',
    'file',
    `# Windows 11 Web

A web-based Windows 11 clone built with Next.js, React, and TypeScript.

## Features

- Window management (drag, resize, minimize, maximize)
- Virtual filesystem using IndexedDB
- Multiple applications
- Dark/Light theme support
- Responsive design

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Dexie (IndexedDB)`
  ),
];

export const initializeFileSystem = async (): Promise<void> => {
  // Check if filesystem is already initialized
  const count = await db.items.count();
  if (count > 0) {
    return; // Already initialized
  }

  // Add default folders and files
  await db.items.bulkAdd([...DEFAULT_FOLDERS, ...DEFAULT_FILES]);
};

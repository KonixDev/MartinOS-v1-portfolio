import Dexie, { type Table } from 'dexie';
import { FileSystemItem } from '@/types';

export class FileSystemDB extends Dexie {
  items!: Table<FileSystemItem>;

  constructor() {
    super('WindowsFileSystem');
    this.version(1).stores({
      items: '++id, path, parentPath, type, name',
    });
  }
}

export const db = new FileSystemDB();

// Re-export types
export type { FileSystemItem };

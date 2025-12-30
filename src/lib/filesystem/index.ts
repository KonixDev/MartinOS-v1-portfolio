import Dexie, { type Table } from 'dexie';
import { FileSystemItem } from '@/types';

export class FileSystemDB extends Dexie {
  items!: Table<FileSystemItem>;

  constructor() {
    super('WindowsFileSystem');
    // Use path as primary key to ensure uniqueness
    this.version(2).stores({
      items: 'path, parentPath, type, name',
    });
  }
}

export const db = new FileSystemDB();

// Re-export types
export type { FileSystemItem };

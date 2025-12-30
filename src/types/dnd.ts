import type { FileSystemItem } from './file';

// Drag data passed when starting a drag operation
export interface DragData {
  type: 'file' | 'folder' | 'app';
  items: FileSystemItem[];
  sourcePath: string;
  sourceContext: 'desktop' | 'file-explorer';
}

// Drop target data
export interface DropData {
  type: 'folder' | 'desktop' | 'file-list';
  targetPath: string;
}

// Drag state for UI feedback
export interface DragState {
  isDragging: boolean;
  activeItems: FileSystemItem[];
  sourceContext: 'desktop' | 'file-explorer' | null;
}

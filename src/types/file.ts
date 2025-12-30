export type FileType = 'file' | 'folder';

export type FileMimeType =
  | 'text/plain'
  | 'text/markdown'
  | 'text/html'
  | 'text/css'
  | 'text/javascript'
  | 'application/json'
  | 'image/png'
  | 'image/jpeg'
  | 'image/gif'
  | 'image/svg+xml'
  | 'application/pdf'
  | 'application/octet-stream';

export interface FileSystemItem {
  id?: number;
  name: string;
  path: string;
  parentPath: string;
  type: FileType;
  mimeType?: FileMimeType;
  content?: string;
  blobId?: string;
  icon?: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  isHidden?: boolean;
  isSystem?: boolean;
}

export interface FileOperationResult {
  success: boolean;
  error?: string;
  item?: FileSystemItem;
}

export interface ClipboardItem {
  items: FileSystemItem[];
  operation: 'copy' | 'cut';
}

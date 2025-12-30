// File Utilities - Helpers for file handling in MartinOS
//
// This module provides utilities for:
// - File icons: getFileIcon, FileIcon component
// - File types: isTextFile, isImageFile, getFileCategory, getMimeType
// - File associations: getDefaultApp, getOpenableApps, canOpenWith

// File Icons
export { getFileIcon, FileIcon } from './fileIcons';
export type { FileIconConfig } from './fileIcons';

// File Types
export {
  getFileCategory,
  getMimeType,
  isTextFile,
  isImageFile,
  isAudioFile,
  isVideoFile,
  isArchiveFile,
  isDocumentFile,
  isExecutableFile,
} from './fileTypes';
export type { FileCategory } from './fileTypes';

// File Associations
export {
  getDefaultApp,
  getOpenableApps,
  canOpenWith,
} from './fileAssociations';

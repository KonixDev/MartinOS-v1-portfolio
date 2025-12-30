'use client';

import {
  FolderFilled,
  DocumentFilled,
  DocumentTextFilled,
  ImageFilled,
  MusicNote2Filled,
  VideoFilled,
  CodeFilled,
  ArchiveFilled,
  DocumentPdfFilled,
  SettingsFilled,
} from '@fluentui/react-icons';
import type { ComponentType } from 'react';

/**
 * File icon configuration
 */
export interface FileIconConfig {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

/**
 * Default icon for unknown file types
 */
const DEFAULT_ICON: FileIconConfig = {
  icon: DocumentFilled,
  color: '#6B6B6B',
};

/**
 * Folder icon configuration
 */
const FOLDER_ICON: FileIconConfig = {
  icon: FolderFilled,
  color: '#FFB900',
};

/**
 * Icon configurations by file extension
 */
const EXTENSION_ICONS: Record<string, FileIconConfig> = {
  // Text files
  txt: { icon: DocumentTextFilled, color: '#0078D4' },
  md: { icon: DocumentTextFilled, color: '#0078D4' },
  rtf: { icon: DocumentTextFilled, color: '#0078D4' },
  log: { icon: DocumentTextFilled, color: '#6B6B6B' },

  // Code files
  js: { icon: CodeFilled, color: '#F7DF1E' },
  jsx: { icon: CodeFilled, color: '#61DAFB' },
  ts: { icon: CodeFilled, color: '#3178C6' },
  tsx: { icon: CodeFilled, color: '#3178C6' },
  css: { icon: CodeFilled, color: '#264DE4' },
  scss: { icon: CodeFilled, color: '#CC6699' },
  html: { icon: CodeFilled, color: '#E34F26' },
  json: { icon: CodeFilled, color: '#4CAF50' },
  xml: { icon: CodeFilled, color: '#4CAF50' },
  yaml: { icon: CodeFilled, color: '#4CAF50' },
  yml: { icon: CodeFilled, color: '#4CAF50' },
  py: { icon: CodeFilled, color: '#3776AB' },
  java: { icon: CodeFilled, color: '#007396' },
  c: { icon: CodeFilled, color: '#A8B9CC' },
  cpp: { icon: CodeFilled, color: '#00599C' },
  cs: { icon: CodeFilled, color: '#239120' },
  go: { icon: CodeFilled, color: '#00ADD8' },
  rs: { icon: CodeFilled, color: '#DEA584' },
  php: { icon: CodeFilled, color: '#777BB4' },
  rb: { icon: CodeFilled, color: '#CC342D' },
  swift: { icon: CodeFilled, color: '#FA7343' },
  kt: { icon: CodeFilled, color: '#7F52FF' },
  sh: { icon: CodeFilled, color: '#4EAA25' },
  bash: { icon: CodeFilled, color: '#4EAA25' },

  // Image files
  png: { icon: ImageFilled, color: '#FF8C00' },
  jpg: { icon: ImageFilled, color: '#FF8C00' },
  jpeg: { icon: ImageFilled, color: '#FF8C00' },
  gif: { icon: ImageFilled, color: '#FF8C00' },
  svg: { icon: ImageFilled, color: '#FFB13B' },
  webp: { icon: ImageFilled, color: '#FF8C00' },
  ico: { icon: ImageFilled, color: '#FF8C00' },
  bmp: { icon: ImageFilled, color: '#FF8C00' },
  tiff: { icon: ImageFilled, color: '#FF8C00' },

  // Audio files
  mp3: { icon: MusicNote2Filled, color: '#E91E63' },
  wav: { icon: MusicNote2Filled, color: '#E91E63' },
  ogg: { icon: MusicNote2Filled, color: '#E91E63' },
  flac: { icon: MusicNote2Filled, color: '#E91E63' },
  aac: { icon: MusicNote2Filled, color: '#E91E63' },
  wma: { icon: MusicNote2Filled, color: '#E91E63' },
  m4a: { icon: MusicNote2Filled, color: '#E91E63' },

  // Video files
  mp4: { icon: VideoFilled, color: '#9C27B0' },
  avi: { icon: VideoFilled, color: '#9C27B0' },
  mkv: { icon: VideoFilled, color: '#9C27B0' },
  mov: { icon: VideoFilled, color: '#9C27B0' },
  wmv: { icon: VideoFilled, color: '#9C27B0' },
  flv: { icon: VideoFilled, color: '#9C27B0' },
  webm: { icon: VideoFilled, color: '#9C27B0' },

  // Archive files
  zip: { icon: ArchiveFilled, color: '#FFC107' },
  rar: { icon: ArchiveFilled, color: '#FFC107' },
  '7z': { icon: ArchiveFilled, color: '#FFC107' },
  tar: { icon: ArchiveFilled, color: '#FFC107' },
  gz: { icon: ArchiveFilled, color: '#FFC107' },

  // Document files
  pdf: { icon: DocumentPdfFilled, color: '#FF0000' },
  doc: { icon: DocumentFilled, color: '#2B579A' },
  docx: { icon: DocumentFilled, color: '#2B579A' },
  xls: { icon: DocumentFilled, color: '#217346' },
  xlsx: { icon: DocumentFilled, color: '#217346' },
  ppt: { icon: DocumentFilled, color: '#D24726' },
  pptx: { icon: DocumentFilled, color: '#D24726' },

  // Config files
  ini: { icon: SettingsFilled, color: '#6B6B6B' },
  cfg: { icon: SettingsFilled, color: '#6B6B6B' },
  conf: { icon: SettingsFilled, color: '#6B6B6B' },
  env: { icon: SettingsFilled, color: '#6B6B6B' },
};

/**
 * Get file extension from filename
 */
function getExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Get icon configuration for a file
 *
 * @param filename - The filename or path
 * @param isFolder - Whether this is a folder
 * @returns Icon configuration with component and color
 */
export function getFileIcon(filename: string, isFolder = false): FileIconConfig {
  if (isFolder) {
    return FOLDER_ICON;
  }

  const extension = getExtension(filename);
  return EXTENSION_ICONS[extension] || DEFAULT_ICON;
}

/**
 * Render file icon as JSX element
 *
 * @param filename - The filename or path
 * @param isFolder - Whether this is a folder
 * @param className - Additional CSS classes
 * @returns JSX element with the icon
 */
export function FileIcon({
  filename,
  isFolder = false,
  className = 'w-10 h-10',
}: {
  filename: string;
  isFolder?: boolean;
  className?: string;
}) {
  const { icon: Icon, color } = getFileIcon(filename, isFolder);
  return <Icon className={className} style={{ color }} />;
}

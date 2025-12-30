/**
 * File category types
 */
export type FileCategory =
  | 'text'
  | 'code'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'executable'
  | 'config'
  | 'unknown';

/**
 * Extension to category mapping
 */
const EXTENSION_CATEGORIES: Record<string, FileCategory> = {
  // Text
  txt: 'text',
  md: 'text',
  rtf: 'text',
  log: 'text',

  // Code
  js: 'code',
  jsx: 'code',
  ts: 'code',
  tsx: 'code',
  css: 'code',
  scss: 'code',
  html: 'code',
  json: 'code',
  xml: 'code',
  yaml: 'code',
  yml: 'code',
  py: 'code',
  java: 'code',
  c: 'code',
  cpp: 'code',
  cs: 'code',
  go: 'code',
  rs: 'code',
  php: 'code',
  rb: 'code',
  swift: 'code',
  kt: 'code',
  sh: 'code',
  bash: 'code',
  sql: 'code',

  // Images
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  svg: 'image',
  webp: 'image',
  ico: 'image',
  bmp: 'image',
  tiff: 'image',

  // Audio
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  flac: 'audio',
  aac: 'audio',
  wma: 'audio',
  m4a: 'audio',

  // Video
  mp4: 'video',
  avi: 'video',
  mkv: 'video',
  mov: 'video',
  wmv: 'video',
  flv: 'video',
  webm: 'video',

  // Archives
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  tar: 'archive',
  gz: 'archive',

  // Documents
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  xls: 'document',
  xlsx: 'document',
  ppt: 'document',
  pptx: 'document',
  odt: 'document',
  ods: 'document',

  // Config
  ini: 'config',
  cfg: 'config',
  conf: 'config',
  env: 'config',

  // Executables
  exe: 'executable',
  msi: 'executable',
  bat: 'executable',
  cmd: 'executable',
  app: 'executable',
  dmg: 'executable',
};

/**
 * MIME type mapping
 */
const EXTENSION_MIME: Record<string, string> = {
  // Text
  txt: 'text/plain',
  md: 'text/markdown',
  html: 'text/html',
  css: 'text/css',
  json: 'application/json',
  xml: 'application/xml',

  // Images
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  ico: 'image/x-icon',

  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  flac: 'audio/flac',

  // Video
  mp4: 'video/mp4',
  webm: 'video/webm',
  avi: 'video/x-msvideo',
  mov: 'video/quicktime',

  // Documents
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  // Archives
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
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
 * Get the file category
 */
export function getFileCategory(filename: string): FileCategory {
  const extension = getExtension(filename);
  return EXTENSION_CATEGORIES[extension] || 'unknown';
}

/**
 * Get MIME type for a file
 */
export function getMimeType(filename: string): string {
  const extension = getExtension(filename);
  return EXTENSION_MIME[extension] || 'application/octet-stream';
}

/**
 * Check if file is a text file (editable in Notepad)
 */
export function isTextFile(filename: string): boolean {
  const category = getFileCategory(filename);
  return category === 'text' || category === 'code' || category === 'config';
}

/**
 * Check if file is an image
 */
export function isImageFile(filename: string): boolean {
  return getFileCategory(filename) === 'image';
}

/**
 * Check if file is audio
 */
export function isAudioFile(filename: string): boolean {
  return getFileCategory(filename) === 'audio';
}

/**
 * Check if file is video
 */
export function isVideoFile(filename: string): boolean {
  return getFileCategory(filename) === 'video';
}

/**
 * Check if file is an archive
 */
export function isArchiveFile(filename: string): boolean {
  return getFileCategory(filename) === 'archive';
}

/**
 * Check if file is a document (PDF, Office, etc.)
 */
export function isDocumentFile(filename: string): boolean {
  return getFileCategory(filename) === 'document';
}

/**
 * Check if file is executable
 */
export function isExecutableFile(filename: string): boolean {
  return getFileCategory(filename) === 'executable';
}

import { getFileCategory, isTextFile, isImageFile } from './fileTypes';

/**
 * App ID associations by file extension
 */
const EXTENSION_APPS: Record<string, string> = {
  // Text files -> Notepad
  txt: 'notepad',
  md: 'notepad',
  log: 'notepad',
  rtf: 'notepad',
  json: 'notepad',
  xml: 'notepad',
  yaml: 'notepad',
  yml: 'notepad',
  ini: 'notepad',
  cfg: 'notepad',
  conf: 'notepad',
  env: 'notepad',

  // Code files -> Notepad (could be a dedicated code editor in the future)
  js: 'notepad',
  jsx: 'notepad',
  ts: 'notepad',
  tsx: 'notepad',
  css: 'notepad',
  scss: 'notepad',
  html: 'notepad',
  py: 'notepad',
  java: 'notepad',
  c: 'notepad',
  cpp: 'notepad',
  cs: 'notepad',
  go: 'notepad',
  rs: 'notepad',
  php: 'notepad',
  rb: 'notepad',
  swift: 'notepad',
  kt: 'notepad',
  sh: 'notepad',
  bash: 'notepad',
  sql: 'notepad',

  // Images -> Image Viewer
  png: 'image-viewer',
  jpg: 'image-viewer',
  jpeg: 'image-viewer',
  gif: 'image-viewer',
  svg: 'image-viewer',
  webp: 'image-viewer',
  ico: 'image-viewer',
  bmp: 'image-viewer',
  tiff: 'image-viewer',

  // Web URLs -> Browser
  url: 'browser',
  htm: 'browser',
  // Note: html is in code section, can open with notepad or browser
};

/**
 * Category to app mapping (fallback)
 */
const CATEGORY_APPS: Record<string, string> = {
  text: 'notepad',
  code: 'notepad',
  config: 'notepad',
  image: 'image-viewer',
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
 * Get the default app ID for a file
 *
 * @param filename - The filename or path
 * @returns The app ID or null if no association
 */
export function getDefaultApp(filename: string): string | null {
  const extension = getExtension(filename);

  // Check specific extension mapping
  if (EXTENSION_APPS[extension]) {
    return EXTENSION_APPS[extension];
  }

  // Check category mapping
  const category = getFileCategory(filename);
  if (CATEGORY_APPS[category]) {
    return CATEGORY_APPS[category];
  }

  return null;
}

/**
 * Get all apps that can open a specific file
 *
 * @param filename - The filename or path
 * @returns Array of app IDs that can open this file
 */
export function getOpenableApps(filename: string): string[] {
  const apps: string[] = [];
  const defaultApp = getDefaultApp(filename);

  if (defaultApp) {
    apps.push(defaultApp);
  }

  // Add additional apps based on file type
  if (isTextFile(filename)) {
    if (!apps.includes('notepad')) {
      apps.push('notepad');
    }
  }

  if (isImageFile(filename)) {
    if (!apps.includes('image-viewer')) {
      apps.push('image-viewer');
    }
  }

  return apps;
}

/**
 * Check if a specific app can open a file
 *
 * @param filename - The filename or path
 * @param appId - The app ID to check
 * @returns Whether the app can open the file
 */
export function canOpenWith(filename: string, appId: string): boolean {
  const openableApps = getOpenableApps(filename);
  return openableApps.includes(appId);
}

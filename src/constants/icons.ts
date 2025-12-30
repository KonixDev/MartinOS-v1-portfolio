// File type icons (using ICO files from public/icons)
export const FILE_ICONS = {
  folder: '/icons/folders/folder.ico',
  folderOpen: '/icons/folders/folder.ico',
  file: '/icons/files/generic.ico',
  text: '/icons/files/text.ico',
  image: '/icons/files/image.ico',
  video: '/icons/files/video.ico',
  audio: '/icons/files/audio.ico',
  pdf: '/icons/files/document.ico',
  archive: '/icons/folders/zip.ico',
  code: '/icons/applications/visualcode.ico',
  executable: '/icons/files/windowexecutable.ico',
};

// App icons (using ICO files from public/icons/applications)
export const APP_ICONS = {
  fileExplorer: '/icons/folders/explorer.ico',
  notepad: '/icons/applications/notepad.ico',
  settings: '/icons/applications/settings.ico',
  edge: '/icons/applications/edge.ico',
  terminal: '/icons/applications/terminal.ico',
  calculator: '/icons/applications/calculator.ico',
  photos: '/icons/files/image.ico',
  store: '/icons/applications/store3.ico',
  mail: '/icons/applications/stickynotes.ico',
  calendar: '/icons/applications/calendar.ico',
};

// Quick access icons (using ICO files from public/icons/folders)
export const QUICK_ACCESS_ICONS = {
  desktop: '/icons/folders/desktop.ico',
  downloads: '/icons/folders/downloads.ico',
  documents: '/icons/folders/documents.ico',
  pictures: '/icons/folders/pictures.ico',
  music: '/icons/folders/music.ico',
  videos: '/icons/folders/videos.ico',
  thisPC: '/icons/folders/explorer.ico',
  network: '/icons/folders/network.ico',
};

// Get icon for file extension
export const getFileIcon = (extension: string): string => {
  const iconMap: Record<string, string> = {
    // Text files
    txt: FILE_ICONS.text,
    md: FILE_ICONS.text,
    log: FILE_ICONS.text,

    // Code files
    js: FILE_ICONS.code,
    ts: FILE_ICONS.code,
    jsx: FILE_ICONS.code,
    tsx: FILE_ICONS.code,
    html: FILE_ICONS.code,
    css: FILE_ICONS.code,
    json: FILE_ICONS.code,

    // Images
    png: FILE_ICONS.image,
    jpg: FILE_ICONS.image,
    jpeg: FILE_ICONS.image,
    gif: FILE_ICONS.image,
    svg: FILE_ICONS.image,
    webp: FILE_ICONS.image,

    // Documents
    pdf: FILE_ICONS.pdf,

    // Archives
    zip: FILE_ICONS.archive,
    rar: FILE_ICONS.archive,
    '7z': FILE_ICONS.archive,
    tar: FILE_ICONS.archive,
    gz: FILE_ICONS.archive,

    // Audio
    mp3: FILE_ICONS.audio,
    wav: FILE_ICONS.audio,
    ogg: FILE_ICONS.audio,
    flac: FILE_ICONS.audio,

    // Video
    mp4: FILE_ICONS.video,
    mkv: FILE_ICONS.video,
    avi: FILE_ICONS.video,
    mov: FILE_ICONS.video,
    webm: FILE_ICONS.video,
  };

  return iconMap[extension.toLowerCase()] || FILE_ICONS.file;
};

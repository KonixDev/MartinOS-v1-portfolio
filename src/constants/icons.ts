// System icons
export const SYSTEM_ICONS = {
  windows: '/icons/system/windows.svg',
  search: '/icons/system/search.svg',
  taskView: '/icons/system/task-view.svg',
  widgets: '/icons/system/widgets.svg',
  chat: '/icons/system/chat.svg',

  // System tray icons
  wifi: '/icons/system/wifi.svg',
  volume: '/icons/system/volume.svg',
  battery: '/icons/system/battery.svg',
  bluetooth: '/icons/system/bluetooth.svg',
  notifications: '/icons/system/notifications.svg',

  // Window controls
  minimize: '/icons/system/minimize.svg',
  maximize: '/icons/system/maximize.svg',
  restore: '/icons/system/restore.svg',
  close: '/icons/system/close.svg',

  // Navigation
  back: '/icons/system/back.svg',
  forward: '/icons/system/forward.svg',
  up: '/icons/system/up.svg',
  refresh: '/icons/system/refresh.svg',
  home: '/icons/system/home.svg',

  // Power
  power: '/icons/system/power.svg',
  sleep: '/icons/system/sleep.svg',
  restart: '/icons/system/restart.svg',
  shutdown: '/icons/system/shutdown.svg',

  // Actions
  copy: '/icons/system/copy.svg',
  cut: '/icons/system/cut.svg',
  paste: '/icons/system/paste.svg',
  delete: '/icons/system/delete.svg',
  rename: '/icons/system/rename.svg',
  newFolder: '/icons/system/new-folder.svg',
  newFile: '/icons/system/new-file.svg',
};

// File type icons
export const FILE_ICONS = {
  folder: '/icons/files/folder.svg',
  folderOpen: '/icons/files/folder-open.svg',
  file: '/icons/files/file.svg',
  text: '/icons/files/text.svg',
  image: '/icons/files/image.svg',
  video: '/icons/files/video.svg',
  audio: '/icons/files/audio.svg',
  pdf: '/icons/files/pdf.svg',
  archive: '/icons/files/archive.svg',
  code: '/icons/files/code.svg',
  executable: '/icons/files/executable.svg',
};

// App icons
export const APP_ICONS = {
  fileExplorer: '/icons/apps/file-explorer.svg',
  notepad: '/icons/apps/notepad.svg',
  settings: '/icons/apps/settings.svg',
  edge: '/icons/apps/edge.svg',
  terminal: '/icons/apps/terminal.svg',
  calculator: '/icons/apps/calculator.svg',
  photos: '/icons/apps/photos.svg',
  store: '/icons/apps/store.svg',
  mail: '/icons/apps/mail.svg',
  calendar: '/icons/apps/calendar.svg',
};

// Quick access icons
export const QUICK_ACCESS_ICONS = {
  desktop: '/icons/files/desktop.svg',
  downloads: '/icons/files/downloads.svg',
  documents: '/icons/files/documents.svg',
  pictures: '/icons/files/pictures.svg',
  music: '/icons/files/music.svg',
  videos: '/icons/files/videos.svg',
  thisPC: '/icons/files/this-pc.svg',
  network: '/icons/files/network.svg',
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

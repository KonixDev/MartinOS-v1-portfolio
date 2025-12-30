import { Settings } from '@/types';

export const DEFAULT_WALLPAPERS = [
  '/wallpapers/windows11-default.jpg',
  '/wallpapers/windows11-light.jpg',
  '/wallpapers/windows11-dark.jpg',
  '/wallpapers/windows11-bloom.jpg',
  '/wallpapers/windows11-glow.jpg',
  '/wallpapers/windows11-captured-motion.jpg',
  '/wallpapers/windows11-sunrise.jpg',
  '/wallpapers/windows11-flow.jpg',
];

export const ACCENT_COLORS = [
  { name: 'Blue', value: '#0078d4' },
  { name: 'Purple', value: '#8764b8' },
  { name: 'Red', value: '#e81123' },
  { name: 'Orange', value: '#f7630c' },
  { name: 'Yellow', value: '#ffb900' },
  { name: 'Green', value: '#107c10' },
  { name: 'Teal', value: '#00b7c3' },
  { name: 'Pink', value: '#e3008c' },
];

export const DEFAULT_SETTINGS: Settings = {
  personalization: {
    theme: 'system',
    wallpaper: DEFAULT_WALLPAPERS[0],
    accentColor: ACCENT_COLORS[0].value,
    transparencyEffects: true,
    animationEffects: true,
  },
  taskbar: {
    alignment: 'center',
    position: 'bottom',
    autoHide: false,
    showBadges: true,
    pinnedApps: ['file-explorer', 'browser', 'terminal'],
  },
  system: {
    language: 'en-US',
    region: 'US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  showDesktopIcons: true,
};

export const TASKBAR_HEIGHT = 48;
export const DESKTOP_ICON_SIZE = 74;
export const DESKTOP_ICON_GRID_SIZE = 100;
export const WINDOW_BORDER_RADIUS = 8;
export const WINDOW_TITLE_BAR_HEIGHT = 32;

export const Z_INDEX = {
  desktop: 0,
  desktopIcons: 10,
  windows: 100,
  taskbar: 1000,
  startMenu: 1100,
  contextMenu: 1200,
  notifications: 1300,
  modal: 1400,
};

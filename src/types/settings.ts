export type ThemeMode = 'light' | 'dark' | 'system';

// Alias for backward compatibility
export type Theme = 'light' | 'dark';

export type TaskbarAlignment = 'center' | 'left';

export type TaskbarPosition = 'bottom' | 'top';

export interface PersonalizationSettings {
  theme: ThemeMode;
  wallpaper: string;
  accentColor: string;
  transparencyEffects: boolean;
  animationEffects: boolean;
}

export interface TaskbarSettings {
  alignment: TaskbarAlignment;
  position: TaskbarPosition;
  autoHide: boolean;
  showBadges: boolean;
  pinnedApps: string[];
}

export interface SystemSettings {
  language: string;
  region: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface Settings {
  personalization: PersonalizationSettings;
  taskbar: TaskbarSettings;
  system: SystemSettings;
  showDesktopIcons: boolean;
}

export interface SettingsActions {
  setTheme: (theme: ThemeMode) => void;
  setWallpaper: (wallpaper: string) => void;
  setAccentColor: (color: string) => void;
  setTaskbarAlignment: (alignment: TaskbarAlignment) => void;
  toggleTransparency: () => void;
  toggleAnimations: () => void;
  resetToDefaults: () => void;
}

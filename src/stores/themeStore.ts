import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '@/types';

// Available wallpapers
export const WALLPAPERS = [
  { id: '1', name: 'Windows Bloom', url: '/wallpapers/1.webp', thumbnail: '/wallpapers/1.webp', color: '#1a5fb4' },
  { id: '2', name: 'Abstract Flow', url: '/wallpapers/2.webp', thumbnail: '/wallpapers/2.webp', color: '#613583' },
  { id: '3', name: 'Light Waves', url: '/wallpapers/3.webp', thumbnail: '/wallpapers/3.webp', color: '#1c71d8' },
  { id: '4', name: 'Mountain Vista', url: '/wallpapers/4.webp', thumbnail: '/wallpapers/4.webp', color: '#1e3a5f' },
  { id: '5', name: 'Sunset Glow', url: '/wallpapers/5.webp', thumbnail: '/wallpapers/5.webp', color: '#c64600' },
  { id: '6', name: 'Nature Green', url: '/wallpapers/6.webp', thumbnail: '/wallpapers/6.webp', color: '#26a269' },
  { id: '7', name: 'Ocean Blue', url: '/wallpapers/7.webp', thumbnail: '/wallpapers/7.webp', color: '#1a5fb4' },
  { id: 'solid-dark', name: 'Solid Dark', url: '', thumbnail: '', color: '#202020' },
  { id: 'solid-blue', name: 'Solid Blue', url: '', thumbnail: '', color: '#0078d4' },
  { id: 'solid-purple', name: 'Solid Purple', url: '', thumbnail: '', color: '#744da9' },
  { id: 'solid-teal', name: 'Solid Teal', url: '', thumbnail: '', color: '#00b7c3' },
  { id: 'solid-green', name: 'Solid Green', url: '', thumbnail: '', color: '#107c10' },
];

interface ThemeStore {
  theme: Theme;
  wallpaper: string;
  wallpaperColor: string;
  accentColor: string;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setWallpaper: (wallpaperId: string) => void;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      wallpaper: '1', // Windows Bloom
      wallpaperColor: '#1a5fb4',
      accentColor: '#0078d4',

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.body.classList.toggle('dark', theme === 'dark');
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      setWallpaper: (wallpaperId) => {
        const wallpaper = WALLPAPERS.find(w => w.id === wallpaperId);
        if (wallpaper) {
          set({
            wallpaper: wallpaperId,
            wallpaperColor: wallpaper.color
          });
        }
      },

      setAccentColor: (color) => {
        set({ accentColor: color });
      },
    }),
    {
      name: 'win11-theme',
    }
  )
);

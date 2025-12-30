'use client';

import { cn } from '@/lib/utils';
import { useFileSystemStore } from '@/stores';
import {
  HomeFilled,
  FolderFilled,
  DocumentFilled,
  ArrowDownloadFilled,
  ImageFilled,
  MusicNote2Filled,
  VideoFilled,
  DesktopFilled,
} from '@fluentui/react-icons';

interface QuickAccessItem {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    icon: <HomeFilled className="w-4 h-4" />,
  },
  {
    id: 'desktop',
    name: 'Desktop',
    path: '/Desktop',
    icon: <DesktopFilled className="w-4 h-4" />,
  },
  {
    id: 'documents',
    name: 'Documents',
    path: '/Documents',
    icon: <DocumentFilled className="w-4 h-4" style={{ color: '#0078D4' }} />,
  },
  {
    id: 'downloads',
    name: 'Downloads',
    path: '/Downloads',
    icon: <ArrowDownloadFilled className="w-4 h-4" style={{ color: '#0078D4' }} />,
  },
  {
    id: 'pictures',
    name: 'Pictures',
    path: '/Pictures',
    icon: <ImageFilled className="w-4 h-4" style={{ color: '#0078D4' }} />,
  },
  {
    id: 'music',
    name: 'Music',
    path: '/Music',
    icon: <MusicNote2Filled className="w-4 h-4" style={{ color: '#0078D4' }} />,
  },
  {
    id: 'videos',
    name: 'Videos',
    path: '/Videos',
    icon: <VideoFilled className="w-4 h-4" style={{ color: '#0078D4' }} />,
  },
];

export function Sidebar() {
  const currentPath = useFileSystemStore((state) => state.currentPath);
  const navigateTo = useFileSystemStore((state) => state.navigateTo);

  return (
    <div
      className={cn(
        'w-48 flex-shrink-0 overflow-y-auto',
        'border-r border-win-border dark:border-win-dark-border',
        'bg-win-bg dark:bg-win-dark-bg'
      )}
    >
      <div className="p-2">
        <div className="text-xs font-medium text-win-text-secondary dark:text-win-dark-text-secondary px-2 py-1">
          Quick access
        </div>

        <nav className="mt-1 space-y-0.5">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.path)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded',
                'text-sm text-left',
                'transition-colors duration-100',
                currentPath === item.path
                  ? 'bg-win-accent/10 text-win-accent'
                  : 'text-win-text-primary dark:text-win-dark-text-primary hover:bg-black/5 dark:hover:bg-white/10'
              )}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

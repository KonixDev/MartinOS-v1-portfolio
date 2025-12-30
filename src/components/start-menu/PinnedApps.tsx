'use client';

import { cn } from '@/lib/utils';
import { PINNED_APPS, APP_REGISTRY } from '@/constants';

interface PinnedAppsProps {
  searchQuery?: string;
  onAppClick: (appId: string) => void;
}

export function PinnedApps({ searchQuery = '', onAppClick }: PinnedAppsProps) {
  // Filter apps based on search query
  const filteredApps = PINNED_APPS.filter((appId) => {
    const app = APP_REGISTRY[appId];
    if (!app) return false;
    if (!searchQuery) return true;
    return app.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (filteredApps.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary">
          No apps found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-1">
      {filteredApps.map((appId) => {
        const app = APP_REGISTRY[appId];
        if (!app) return null;

        return (
          <button
            key={appId}
            onClick={() => onAppClick(appId)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-md',
              'transition-colors duration-100',
              'hover:bg-white/10 active:bg-white/20'
            )}
          >
            {/* App Icon */}
            <div className="w-8 h-8 flex items-center justify-center">
              {typeof app.icon === 'string' ? (
                app.icon.startsWith('/') ? (
                  <img
                    src={app.icon}
                    alt=""
                    className="w-8 h-8 object-contain"
                    draggable={false}
                  />
                ) : (
                  <span className="text-2xl">{app.icon}</span>
                )
              ) : (
                app.icon
              )}
            </div>

            {/* App Name */}
            <span
              className={cn(
                'text-xs text-center text-win-text-primary dark:text-win-dark-text-primary',
                'line-clamp-2 leading-tight'
              )}
            >
              {app.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

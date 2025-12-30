'use client';

import { useWindowStore } from '@/stores/windowStore';
import { Window } from './Window';
import { APP_REGISTRY } from '@/constants';

export function WindowManager() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {windows.map((window) => {
          const app = APP_REGISTRY[window.appId];
          const AppComponent = app?.component;

          return (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              icon={app?.icon}
              x={window.x}
              y={window.y}
              width={window.width}
              height={window.height}
              minWidth={window.minWidth}
              minHeight={window.minHeight}
              isMinimized={window.isMinimized}
              isMaximized={window.isMaximized}
              zIndex={window.zIndex}
            >
              {AppComponent ? (
                <AppComponent windowId={window.id} />
              ) : (
                <div className="flex items-center justify-center h-full text-win-text-secondary dark:text-win-dark-text-secondary">
                  <p>App not found: {window.appId}</p>
                </div>
              )}
            </Window>
          );
        })}
    </div>
  );
}

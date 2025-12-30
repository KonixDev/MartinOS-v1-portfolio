'use client';

import { WindowManager } from '@/components/window';
import { useWindowStore } from '@/stores/windowStore';
import { TASKBAR_HEIGHT } from '@/constants';

export default function Home() {
  const openWindow = useWindowStore((state) => state.openWindow);

  // Temporary function to test window opening
  const handleOpenTestWindow = (appId: string) => {
    openWindow(appId, appId.charAt(0).toUpperCase() + appId.slice(1), {
      width: 800,
      height: 600,
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-win-bg-primary dark:bg-win-dark-bg-primary">
      {/* Desktop Background - Windows 11 style gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0078D4 0%, #5C2D91 50%, #D13438 100%)',
          paddingBottom: TASKBAR_HEIGHT,
        }}
      >
        {/* Desktop Icons - Temporary test buttons */}
        <div className="p-4 grid gap-4">
          <button
            onClick={() => handleOpenTestWindow('file-explorer')}
            className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/20 w-20"
          >
            <div className="w-12 h-12 bg-yellow-500 rounded flex items-center justify-center text-white text-xl">
              📁
            </div>
            <span className="text-xs text-white desktop-icon-text">
              File Explorer
            </span>
          </button>

          <button
            onClick={() => handleOpenTestWindow('notepad')}
            className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/20 w-20"
          >
            <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white text-xl">
              📝
            </div>
            <span className="text-xs text-white desktop-icon-text">
              Notepad
            </span>
          </button>

          <button
            onClick={() => handleOpenTestWindow('terminal')}
            className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/20 w-20"
          >
            <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-white text-xl">
              💻
            </div>
            <span className="text-xs text-white desktop-icon-text">
              Terminal
            </span>
          </button>

          <button
            onClick={() => handleOpenTestWindow('calculator')}
            className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/20 w-20"
          >
            <div className="w-12 h-12 bg-teal-500 rounded flex items-center justify-center text-white text-xl">
              🔢
            </div>
            <span className="text-xs text-white desktop-icon-text">
              Calculator
            </span>
          </button>
        </div>
      </div>

      {/* Window Manager */}
      <WindowManager />

      {/* Taskbar Placeholder */}
      <div
        className="absolute bottom-0 left-0 right-0 acrylic taskbar-shadow"
        style={{ height: TASKBAR_HEIGHT }}
      >
        <div className="flex items-center justify-center h-full">
          <span className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary">
            Taskbar (Coming soon)
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import type { AppShellProps } from './types';

/**
 * Loading overlay component
 */
function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-win-window-bg/80 dark:bg-win-dark-window-bg/80 z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-win-accent border-t-transparent rounded-full animate-spin" />
        {message && (
          <span className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Standard app layout wrapper with optional toolbar, menu bar, sidebar, and status bar.
 *
 * @example
 * ```tsx
 * <AppShell
 *   menuBar={<MenuBar />}
 *   toolbar={<Toolbar />}
 *   sidebar={<Sidebar />}
 *   statusBar={<StatusBar />}
 *   isLoading={isLoading}
 * >
 *   <MainContent />
 * </AppShell>
 * ```
 *
 * Layout structure:
 * ```
 * +----------------------------------+
 * |  MenuBar (optional)              |
 * +----------------------------------+
 * |  Toolbar (optional)              |
 * +----------+------------------------+
 * | Sidebar  |                        |
 * | (opt)    |    Content (children)  |
 * +----------+------------------------+
 * |  StatusBar (optional)            |
 * +----------------------------------+
 * ```
 */
export function AppShell({
  children,
  toolbar,
  menuBar,
  sidebar,
  statusBar,
  sidebarWidth = 200,
  sidebarPosition = 'left',
  isLoading = false,
  loadingMessage,
  className,
  contentClassName,
}: AppShellProps) {
  const sidebarStyle = {
    width: typeof sidebarWidth === 'number' ? `${sidebarWidth}px` : sidebarWidth,
    flexShrink: 0,
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        'bg-win-window-bg dark:bg-win-dark-window-bg',
        className
      )}
    >
      {/* Menu Bar */}
      {menuBar && (
        <div
          className={cn(
            'flex-shrink-0',
            'border-b border-win-border dark:border-win-dark-border'
          )}
        >
          {menuBar}
        </div>
      )}

      {/* Toolbar */}
      {toolbar && (
        <div
          className={cn(
            'flex-shrink-0',
            'border-b border-win-border dark:border-win-dark-border',
            'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
          )}
        >
          {toolbar}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar (left) */}
        {sidebar && sidebarPosition === 'left' && (
          <div
            style={sidebarStyle}
            className={cn(
              'flex-shrink-0 overflow-auto',
              'border-r border-win-border dark:border-win-dark-border',
              'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
            )}
          >
            {sidebar}
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            'flex-1 min-w-0 overflow-auto relative',
            contentClassName
          )}
        >
          {isLoading && <LoadingOverlay message={loadingMessage} />}
          {children}
        </div>

        {/* Sidebar (right) */}
        {sidebar && sidebarPosition === 'right' && (
          <div
            style={sidebarStyle}
            className={cn(
              'flex-shrink-0 overflow-auto',
              'border-l border-win-border dark:border-win-dark-border',
              'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
            )}
          >
            {sidebar}
          </div>
        )}
      </div>

      {/* Status Bar */}
      {statusBar && (
        <div
          className={cn(
            'flex-shrink-0',
            'border-t border-win-border dark:border-win-dark-border',
            'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
          )}
        >
          {statusBar}
        </div>
      )}
    </div>
  );
}

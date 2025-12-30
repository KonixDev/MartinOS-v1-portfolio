'use client';

/**
 * Loading fallback component for lazy-loaded apps
 * Shows a Windows 11-style loading indicator
 */
export interface AppLoadingFallbackProps {
  appName?: string;
}

export function AppLoadingFallback({ appName }: AppLoadingFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-win-surface dark:bg-win-dark-surface">
      {/* Windows 11 style loading ring */}
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 border-4 border-win-accent/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-win-accent rounded-full animate-spin" />
      </div>

      {appName && (
        <span className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary">
          Loading {appName}...
        </span>
      )}
    </div>
  );
}

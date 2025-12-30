'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AppProps } from '@/types';
import {
  ArrowLeftFilled,
  ArrowRightFilled,
  ArrowClockwiseFilled,
  HomeFilled,
  LockClosedFilled,
} from '@fluentui/react-icons';

const DEFAULT_URL = 'https://www.wikipedia.org';
const HOME_URL = 'https://www.wikipedia.org';

export function Browser({ windowId }: AppProps) {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [inputUrl, setInputUrl] = useState(DEFAULT_URL);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = useCallback((newUrl: string) => {
    let finalUrl = newUrl;

    // Add https:// if no protocol specified
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      // Check if it looks like a URL or a search query
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        // Treat as search query
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
      }
    }

    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setIsLoading(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(inputUrl);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = url;
    }
  };

  const handleHome = () => {
    navigate(HOME_URL);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const isSecure = url.startsWith('https://');

  return (
    <div className={cn('flex flex-col h-full', 'bg-white dark:bg-win-dark-bg')}>
      {/* Navigation Bar */}
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5',
          'border-b border-win-border dark:border-win-dark-border',
          'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
        )}
      >
        {/* Navigation Buttons */}
        <div className="flex items-center gap-0.5">
          <NavButton
            icon={<ArrowLeftFilled className="w-4 h-4" />}
            onClick={() => {}}
            disabled={!canGoBack}
            title="Back"
          />
          <NavButton
            icon={<ArrowRightFilled className="w-4 h-4" />}
            onClick={() => {}}
            disabled={!canGoForward}
            title="Forward"
          />
          <NavButton
            icon={<ArrowClockwiseFilled className="w-4 h-4" />}
            onClick={handleRefresh}
            title="Refresh"
          />
          <NavButton
            icon={<HomeFilled className="w-4 h-4" />}
            onClick={handleHome}
            title="Home"
          />
        </div>

        {/* Address Bar */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div
            className={cn(
              'flex items-center h-8 rounded-full px-3',
              'bg-white dark:bg-win-dark-bg',
              'border border-win-border dark:border-win-dark-border',
              'focus-within:ring-2 focus-within:ring-win-accent'
            )}
          >
            {/* Security indicator */}
            <LockClosedFilled
              className={cn(
                'w-3 h-3 mr-2 flex-shrink-0',
                isSecure ? 'text-green-600' : 'text-gray-400'
              )}
            />

            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className={cn(
                'flex-1 bg-transparent outline-none text-sm',
                'text-win-text-primary dark:text-win-dark-text-primary',
                'placeholder:text-win-text-secondary'
              )}
              placeholder="Search or enter web address"
            />
          </div>
        </form>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-white">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-win-accent animate-pulse" />
        )}

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={handleIframeLoad}
          title="Browser"
        />

        {/* Blocked content notice */}
        <div
          className={cn(
            'absolute bottom-4 left-4 right-4',
            'p-3 rounded-lg shadow-lg',
            'bg-amber-50 dark:bg-amber-900/20',
            'border border-amber-200 dark:border-amber-800',
            'text-sm text-amber-800 dark:text-amber-200'
          )}
        >
          <strong>Note:</strong> Some websites may not display correctly due to
          iframe restrictions (X-Frame-Options, CSP). This is a limitation of
          web-based browsers.
        </div>
      </div>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}

function NavButton({ icon, onClick, disabled, title }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-full',
        'transition-colors duration-100',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10'
      )}
    >
      {icon}
    </button>
  );
}

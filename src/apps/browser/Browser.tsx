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
  GlobeFilled,
} from '@fluentui/react-icons';

// Sites that work well with iframes
const SUGGESTED_SITES = [
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚', color: '#fff' },
  { name: 'DuckDuckGo', url: 'https://lite.duckduckgo.com/lite/', icon: '🦆', color: '#de5833' },
  { name: 'Archive.org', url: 'https://archive.org', icon: '📦', color: '#428bca' },
  { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/export/embed.html', icon: '🗺️', color: '#7ebc6f' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: '📰', color: '#ff6600' },
  { name: 'Reddit (old)', url: 'https://old.reddit.com', icon: '🔴', color: '#ff4500' },
];

const HOME_URL = 'about:home';

export function Browser({ windowId }: AppProps) {
  const [url, setUrl] = useState(HOME_URL);
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([HOME_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isHomePage = url === HOME_URL;

  const navigate = useCallback((newUrl: string, addToHistory = true) => {
    let finalUrl = newUrl;

    // Handle home page
    if (finalUrl === HOME_URL) {
      setUrl(HOME_URL);
      setInputUrl('');
      if (addToHistory) {
        setHistory(prev => [...prev.slice(0, historyIndex + 1), HOME_URL]);
        setHistoryIndex(prev => prev + 1);
      }
      return;
    }

    // Add https:// if no protocol specified
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('about:')) {
      // Check if it looks like a URL or a search query
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        // Treat as search query using DuckDuckGo (iframe-friendly)
        finalUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(finalUrl)}`;
      }
    }

    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setIsLoading(true);

    if (addToHistory) {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), finalUrl]);
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      navigate(inputUrl);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current && !isHomePage) {
      setIsLoading(true);
      iframeRef.current.src = url;
    }
  };

  const handleHome = () => {
    navigate(HOME_URL);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevUrl = history[newIndex];
      setUrl(prevUrl);
      setInputUrl(prevUrl === HOME_URL ? '' : prevUrl);
      if (prevUrl !== HOME_URL) setIsLoading(true);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setUrl(nextUrl);
      setInputUrl(nextUrl === HOME_URL ? '' : nextUrl);
      if (nextUrl !== HOME_URL) setIsLoading(true);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const isSecure = url.startsWith('https://');

  return (
    <div className={cn('flex flex-col h-full', 'bg-win-window-bg dark:bg-win-dark-window-bg')}>
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
            onClick={handleBack}
            disabled={!canGoBack}
            title="Back"
          />
          <NavButton
            icon={<ArrowRightFilled className="w-4 h-4" />}
            onClick={handleForward}
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
              'bg-win-window-bg dark:bg-win-dark-window-bg',
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
      <div className="flex-1 relative bg-win-window-bg dark:bg-win-dark-window-bg overflow-hidden">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-win-accent animate-pulse z-10" />
        )}

        {/* Home Page */}
        {isHomePage ? (
          <HomePage onNavigate={navigate} />
        ) : (
          <>
            {/* Iframe */}
            <iframe
              ref={iframeRef}
              src={url}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={handleIframeLoad}
              title="Browser"
            />
          </>
        )}
      </div>
    </div>
  );
}

// Home Page Component
function HomePage({ onNavigate }: { onNavigate: (url: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-win-bg-secondary to-win-bg-primary dark:from-win-dark-bg-secondary dark:to-win-dark-bg-primary">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-win-accent flex items-center justify-center">
          <GlobeFilled className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-win-text-primary dark:text-win-dark-text-primary">
          MartinOS Browser
        </h1>
        <p className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary mt-1">
          Explore iframe-compatible websites
        </p>
      </div>

      {/* Suggested Sites */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-medium text-win-text-secondary dark:text-win-dark-text-secondary mb-4 text-center">
          Suggested Sites
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {SUGGESTED_SITES.map((site) => (
            <button
              key={site.name}
              onClick={() => onNavigate(site.url)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg',
                'transition-all duration-150',
                'hover:bg-black/5 dark:hover:bg-white/10',
                'active:scale-95'
              )}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: site.color + '20' }}
              >
                {site.icon}
              </div>
              <span className="text-xs text-win-text-primary dark:text-win-dark-text-primary text-center truncate w-full">
                {site.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div
        className={cn(
          'mt-8 p-3 rounded-lg max-w-md',
          'bg-amber-50 dark:bg-amber-900/20',
          'border border-amber-200 dark:border-amber-800',
          'text-xs text-amber-800 dark:text-amber-200 text-center'
        )}
      >
        <strong>Note:</strong> Some websites block iframe embedding.
        The sites above are known to work well.
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

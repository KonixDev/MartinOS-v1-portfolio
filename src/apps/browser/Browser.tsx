'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AppProps } from '@/types';
import {
  ArrowLeftFilled,
  ArrowRightFilled,
  ArrowClockwiseFilled,
  HomeFilled,
  LockClosedFilled,
  GlobeFilled,
  ShieldFilled,
} from '@fluentui/react-icons';

// CORS proxies for x-frame-bypass
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  //'https://corsproxy.io/?',
  'https://cors.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
];

// Sites that work well with direct iframes (no bypass needed)
// Note: Most sites need bypass due to X-Frame-Options headers
const DIRECT_SITES = [
  'wikipedia.org',
  'archive.org',
  'openstreetmap.org',
];

// Suggested sites for homepage
const SUGGESTED_SITES = [
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚', color: '#fff' },
  { name: 'DuckDuckGo', url: 'https://lite.duckduckgo.com/lite/', icon: '🦆', color: '#de5833' },
  { name: 'GitHub', url: 'https://github.com', icon: '🐙', color: '#333' },
  { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️', color: '#ff0000' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: '📰', color: '#ff6600' },
  { name: 'Reddit', url: 'https://www.reddit.com', icon: '🔴', color: '#ff4500' },
];

const HOME_URL = 'about:home';

// Check if URL can use direct iframe
const canUseDirectIframe = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return DIRECT_SITES.some(site => urlObj.hostname.includes(site));
  } catch {
    return false;
  }
};

export function Browser({ windowId }: AppProps) {
  const [url, setUrl] = useState(HOME_URL);
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([HOME_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [srcdoc, setSrcdoc] = useState<string | null>(null);
  const [useBypass, setUseBypass] = useState(true); // Enable bypass by default
  const [loadError, setLoadError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isHomePage = url === HOME_URL;
  const shouldBypass = useBypass && !canUseDirectIframe(url);

  // Fetch content via CORS proxy
  const fetchViaProxy = useCallback(async (targetUrl: string, proxyIndex = 0): Promise<string> => {
    if (proxyIndex >= CORS_PROXIES.length) {
      throw new Error('All proxies failed');
    }

    const proxy = CORS_PROXIES[proxyIndex];
    try {
      const response = await fetch(proxy + encodeURIComponent(targetUrl));
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.warn(`Proxy ${proxyIndex} failed:`, error);
      return fetchViaProxy(targetUrl, proxyIndex + 1);
    }
  }, []);

  // Navigate function - defined early so it can be used in useEffect
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

  // Load page content via bypass
  const loadBypassContent = useCallback(async (targetUrl: string) => {
    if (!targetUrl || targetUrl === HOME_URL || !targetUrl.startsWith('http')) {
      setSrcdoc(null);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    // Show loading animation
    setSrcdoc(`
      <html>
        <head>
          <style>
            body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f5f5f5; font-family: system-ui, sans-serif; }
            .loader { width: 40px; height: 40px; border: 3px solid #e0e0e0; border-top-color: #0078d4; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .dark body { background: #1a1a1a; }
            .dark .loader { border-color: #333; border-top-color: #0078d4; }
          </style>
        </head>
        <body><div class="loader"></div></body>
      </html>
    `);

    try {
      const html = await fetchViaProxy(targetUrl);

      // Inject base tag and navigation handlers (x-frame-bypass approach)
      const modifiedHtml = html.replace(
        /<head([^>]*)>/i,
        `<head$1>
          <base href="${targetUrl}">
          <style>
            /* Ensure links are clickable */
            a { cursor: pointer; }
          </style>
          <script>
            // X-Frame-Bypass navigation handlers using document.activeElement
            // This is more reliable than e.target.closest('a') for complex sites
            document.addEventListener('click', function(e) {
              var activeEl = document.activeElement;
              if (activeEl && activeEl.href) {
                e.preventDefault();
                window.parent.postMessage({ type: 'navigate', url: activeEl.href }, '*');
              }
            }, true);

            // Fallback: mousedown captures links before focus changes
            document.addEventListener('mousedown', function(e) {
              var link = e.target;
              while (link && link.tagName !== 'A') {
                link = link.parentElement;
              }
              if (link && link.href && !link.href.startsWith('javascript:')) {
                // Store for click handler backup
                window.__xfb_link = link.href;
              } else {
                window.__xfb_link = null;
              }
            }, true);

            // Additional click handler as backup
            document.addEventListener('click', function(e) {
              if (window.__xfb_link) {
                e.preventDefault();
                window.parent.postMessage({ type: 'navigate', url: window.__xfb_link }, '*');
                window.__xfb_link = null;
              }
            }, false);

            // Handle form submissions
            document.addEventListener('submit', function(e) {
              var form = e.target;
              if (form && form.action) {
                e.preventDefault();
                var url = form.action;
                if (form.method && form.method.toLowerCase() === 'post') {
                  // For POST forms, we still need to handle via GET (proxy limitation)
                  var formData = new FormData(form);
                  var params = new URLSearchParams(formData).toString();
                  url = url + (url.includes('?') ? '&' : '?') + params;
                } else {
                  var formData = new FormData(form);
                  var params = new URLSearchParams(formData).toString();
                  url = url + (url.includes('?') ? '&' : '?') + params;
                }
                window.parent.postMessage({ type: 'navigate', url: url }, '*');
              }
            }, true);
          </script>`
      );

      setSrcdoc(modifiedHtml);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load page:', error);
      setLoadError('Failed to load page. The website may not be accessible via proxy.');
      setSrcdoc(null);
      setIsLoading(false);
    }
  }, [fetchViaProxy]);

  // Listen for navigation messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'navigate' && event.data?.url) {
        navigate(event.data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // Load content when URL changes (bypass mode)
  useEffect(() => {
    if (shouldBypass && url !== HOME_URL && url.startsWith('http')) {
      loadBypassContent(url);
    } else {
      setSrcdoc(null);
      setLoadError(null);
    }
  }, [url, shouldBypass, loadBypassContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      navigate(inputUrl);
    }
  };

  const handleRefresh = () => {
    if (!isHomePage) {
      if (shouldBypass) {
        loadBypassContent(url);
      } else if (iframeRef.current) {
        setIsLoading(true);
        iframeRef.current.src = url;
      }
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
    <div className={cn('flex flex-col h-full w-full', 'bg-win-window-bg dark:bg-win-dark-window-bg')}>
      {/* Navigation Bar - Compact for mobile */}
      <div
        className={cn(
          'flex items-center gap-0.5 md:gap-1 px-1 py-0.5 md:py-1 shrink-0',
          'border-b border-win-border dark:border-win-dark-border',
          'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
        )}
      >
        {/* Navigation Buttons - Very compact on mobile */}
        <div className="flex items-center shrink-0">
          <NavButton
            icon={<ArrowLeftFilled className="w-3 h-3 md:w-4 md:h-4" />}
            onClick={handleBack}
            disabled={!canGoBack}
            title="Back"
          />
          <NavButton
            icon={<ArrowRightFilled className="w-3 h-3 md:w-4 md:h-4" />}
            onClick={handleForward}
            disabled={!canGoForward}
            title="Forward"
          />
          <NavButton
            icon={<ArrowClockwiseFilled className="w-3 h-3 md:w-4 md:h-4" />}
            onClick={handleRefresh}
            title="Refresh"
          />
          <NavButton
            icon={<HomeFilled className="w-3 h-3 md:w-4 md:h-4" />}
            onClick={handleHome}
            title="Home"
          />
          {/* Bypass toggle */}
          <button
            onClick={() => setUseBypass(!useBypass)}
            title={useBypass ? 'Proxy Mode: ON (click to disable)' : 'Proxy Mode: OFF (click to enable)'}
            className={cn(
              'w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full shrink-0',
              'transition-colors duration-100',
              useBypass
                ? 'bg-win-accent/20 text-win-accent'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-win-text-secondary'
            )}
          >
            <ShieldFilled className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div
            className={cn(
              'flex items-center h-7 md:h-8 rounded-full px-2 md:px-3',
              'bg-win-window-bg dark:bg-win-dark-window-bg',
              'border border-win-border dark:border-win-dark-border',
              'focus-within:ring-2 focus-within:ring-win-accent'
            )}
          >
            {/* Security indicator - Hidden on mobile */}
            <LockClosedFilled
              className={cn(
                'w-3 h-3 mr-2 shrink-0 hidden md:block',
                isSecure ? 'text-green-600' : 'text-gray-400'
              )}
            />

            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className={cn(
                'flex-1 min-w-0 bg-transparent outline-none text-[11px] md:text-sm',
                'text-win-text-primary dark:text-win-dark-text-primary',
                'placeholder:text-win-text-secondary'
              )}
              placeholder="Search or enter URL"
            />
          </div>
        </form>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-win-window-bg dark:bg-win-dark-window-bg overflow-auto">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-win-accent animate-pulse" />
        )}

        {/* Home Page */}
        {isHomePage ? (
          <HomePage onNavigate={navigate} useBypass={useBypass} />
        ) : loadError ? (
          /* Error State */
          <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-8 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="text-3xl">😕</span>
            </div>
            <h2 className="text-lg font-semibold text-win-text-primary dark:text-win-dark-text-primary mb-2">
              Unable to Load Page
            </h2>
            <p className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary max-w-md mb-4">
              {loadError}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleRefresh()}
                className="px-4 py-2 text-sm bg-win-accent text-white rounded-md hover:bg-win-accent/90"
              >
                Try Again
              </button>
              <button
                onClick={() => setUseBypass(!useBypass)}
                className="px-4 py-2 text-sm border border-win-border dark:border-win-dark-border rounded-md hover:bg-black/5 dark:hover:bg-white/10"
              >
                {useBypass ? 'Try Direct Mode' : 'Try Proxy Mode'}
              </button>
            </div>
          </div>
        ) : shouldBypass && srcdoc ? (
          /* Bypass iframe with srcdoc */
          <iframe
            ref={iframeRef}
            srcDoc={srcdoc}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title="Browser (Proxy)"
          />
        ) : (
          /* Direct iframe */
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleIframeLoad}
            title="Browser"
          />
        )}
      </div>
    </div>
  );
}

// Home Page Component - Responsive
function HomePage({ onNavigate, useBypass }: { onNavigate: (url: string) => void; useBypass: boolean }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-win-bg-secondary to-win-bg-primary dark:from-win-dark-bg-secondary dark:to-win-dark-bg-primary">
      {/* Logo - Smaller on mobile */}
      <div className="mb-4 md:mb-6 text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 rounded-full bg-win-accent flex items-center justify-center">
          <GlobeFilled className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h1 className="text-base md:text-xl font-semibold text-win-text-primary dark:text-win-dark-text-primary">
          MartinOS Browser
        </h1>
        <p className="text-[10px] md:text-xs text-win-text-secondary dark:text-win-dark-text-secondary mt-0.5">
          Browse the web with proxy bypass
        </p>
      </div>

      {/* Suggested Sites - 2 columns on mobile, 6 on desktop */}
      <div className="w-full max-w-[280px] md:max-w-2xl">
        <h2 className="text-[10px] md:text-xs font-medium text-win-text-secondary dark:text-win-dark-text-secondary mb-2 md:mb-3 text-center">
          Popular Sites
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
          {SUGGESTED_SITES.map((site) => (
            <button
              key={site.name}
              onClick={() => onNavigate(site.url)}
              className={cn(
                'flex flex-col items-center gap-1 p-1.5 md:p-2 rounded-lg',
                'transition-all duration-150',
                'hover:bg-black/5 dark:hover:bg-white/10',
                'active:scale-95 active:bg-black/10 dark:active:bg-white/20'
              )}
            >
              <div
                className="w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-lg md:text-xl"
                style={{ backgroundColor: site.color + '20' }}
              >
                {site.icon}
              </div>
              <span className="text-[9px] md:text-[11px] text-win-text-primary dark:text-win-dark-text-primary text-center truncate w-full">
                {site.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Proxy Mode Status - More compact on mobile */}
      <div
        className={cn(
          'mt-3 md:mt-6 p-1.5 md:p-2 rounded-lg w-full max-w-xs md:max-w-md',
          useBypass
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
        )}
      >
        <div className="flex items-center gap-1.5 justify-center">
          <ShieldFilled className={cn(
            'w-3 h-3 md:w-4 md:h-4 shrink-0',
            useBypass ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
          )} />
          <span className={cn(
            'text-[8px] md:text-[10px] leading-tight',
            useBypass ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'
          )}>
            {useBypass
              ? 'Proxy ON — Sites load via CORS proxy'
              : 'Proxy OFF — Only iframe-friendly sites work'}
          </span>
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
        // Touch-friendly size (28px mobile, 32px desktop) - smaller on mobile to save space
        'w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full shrink-0',
        'transition-colors duration-100',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/20'
      )}
    >
      {icon}
    </button>
  );
}

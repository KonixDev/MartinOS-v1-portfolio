'use client';

import { cn } from '@/lib/utils';

export function BootScreen() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999]',
        'flex flex-col items-center justify-center',
        'bg-black'
      )}
    >
      {/* Logo - Windows 11 style */}
      <div className="mb-16 animate-boot-logo">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Windows 11 style logo with 4 squares */}
          <rect x="2" y="2" width="40" height="40" rx="4" fill="#0078D4" />
          <rect x="46" y="2" width="40" height="40" rx="4" fill="#0078D4" />
          <rect x="2" y="46" width="40" height="40" rx="4" fill="#0078D4" />
          <rect x="46" y="46" width="40" height="40" rx="4" fill="#0078D4" />
        </svg>
      </div>

      {/* Spinning Dots - Windows 11 style loading indicator */}
      <div className="animate-boot-spinner">
        <div className="relative w-8 h-8">
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full boot-dot boot-dot-1" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full boot-dot boot-dot-2" style={{ top: '15%', right: '15%' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full boot-dot boot-dot-3" style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full boot-dot boot-dot-4" style={{ bottom: '15%', right: '15%' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full boot-dot boot-dot-5" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
        </div>
      </div>
    </div>
  );
}

export function BootScreenWithText() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999]',
        'flex flex-col items-center justify-center',
        'bg-black'
      )}
    >
      {/* Logo */}
      <div className="mb-12 animate-boot-logo">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="2" width="40" height="40" rx="4" fill="#0078D4" />
          <rect x="46" y="2" width="40" height="40" rx="4" fill="#0078D4" />
          <rect x="2" y="46" width="40" height="40" rx="4" fill="#0078D4" />
          <rect x="46" y="46" width="40" height="40" rx="4" fill="#0078D4" />
        </svg>
      </div>

      {/* Loading text */}
      <p className="text-white text-sm mb-8 opacity-70">MartinOS</p>

      {/* Spinning ring */}
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-boot-spinner" />
    </div>
  );
}

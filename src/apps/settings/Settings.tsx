'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AppProps } from '@/types';
import { useThemeStore } from '@/stores';
import {
  ColorFilled,
  PersonFilled,
  InfoFilled,
  WeatherMoonFilled,
  WeatherSunnyFilled,
  DesktopFilled,
} from '@fluentui/react-icons';

type SettingsPage = 'personalization' | 'system' | 'about';

interface NavItem {
  id: SettingsPage;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'personalization',
    label: 'Personalization',
    icon: <ColorFilled className="w-5 h-5" />,
  },
  {
    id: 'system',
    label: 'System',
    icon: <DesktopFilled className="w-5 h-5" />,
  },
  {
    id: 'about',
    label: 'About',
    icon: <InfoFilled className="w-5 h-5" />,
  },
];

export function Settings({ windowId }: AppProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('personalization');

  return (
    <div className={cn('flex h-full', 'bg-win-window-bg dark:bg-win-dark-window-bg')}>
      {/* Sidebar */}
      <div
        className={cn(
          'w-64 flex-shrink-0 p-4',
          'border-r border-win-border dark:border-win-dark-border',
          'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-win-accent flex items-center justify-center">
            <PersonFilled className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-win-text-primary dark:text-win-dark-text-primary">
              User
            </p>
            <p className="text-xs text-win-text-secondary dark:text-win-dark-text-secondary">
              Local Account
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                'text-sm text-left transition-colors duration-100',
                currentPage === item.id
                  ? 'bg-win-accent/10 text-win-accent'
                  : 'text-win-text-primary dark:text-win-dark-text-primary hover:bg-black/5 dark:hover:bg-white/10'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {currentPage === 'personalization' && <PersonalizationPage />}
        {currentPage === 'system' && <SystemPage />}
        {currentPage === 'about' && <AboutPage />}
      </div>
    </div>
  );
}

function PersonalizationPage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-win-text-primary dark:text-win-dark-text-primary">
        Personalization
      </h1>

      <div className="space-y-6">
        {/* Theme Selection */}
        <SettingsSection title="Choose your color">
          <div className="grid grid-cols-2 gap-4">
            <ThemeOption
              label="Light"
              icon={<WeatherSunnyFilled className="w-8 h-8" />}
              isSelected={theme === 'light'}
              onClick={() => setTheme('light')}
              bgClass="bg-white"
            />
            <ThemeOption
              label="Dark"
              icon={<WeatherMoonFilled className="w-8 h-8" />}
              isSelected={theme === 'dark'}
              onClick={() => setTheme('dark')}
              bgClass="bg-neutral-800"
              textClass="text-white"
            />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

function SystemPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-win-text-primary dark:text-win-dark-text-primary">
        System
      </h1>

      <div className="space-y-6">
        <SettingsSection title="Display">
          <SettingsRow
            label="Resolution"
            value={`${window.innerWidth} x ${window.innerHeight}`}
          />
          <SettingsRow
            label="Scale"
            value={`${Math.round(window.devicePixelRatio * 100)}%`}
          />
        </SettingsSection>

        <SettingsSection title="Storage">
          <SettingsRow label="Used" value="Virtual Filesystem (IndexedDB)" />
        </SettingsSection>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-win-text-primary dark:text-win-dark-text-primary">
        About
      </h1>

      <div className="space-y-6">
        <div
          className={cn(
            'p-6 rounded-lg',
            'bg-win-card-bg dark:bg-win-dark-card-bg',
            'border border-win-border dark:border-win-dark-border'
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-win-accent flex items-center justify-center">
              <DesktopFilled className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-win-text-primary dark:text-win-dark-text-primary">
                MartinOS
              </h2>
              <p className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary">
                Windows 11 Web Clone
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Framework" value="Next.js 16" />
            <InfoRow label="React" value="19.x" />
            <InfoRow label="UI Library" value="Tailwind CSS" />
            <InfoRow label="State Management" value="Zustand" />
            <InfoRow label="Storage" value="IndexedDB (Dexie)" />
          </div>
        </div>

        <div className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary">
          <p>
            This is a web-based recreation of the Windows 11 desktop experience,
            built for educational and demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        'bg-win-card-bg dark:bg-win-dark-card-bg',
        'border border-win-border dark:border-win-dark-border'
      )}
    >
      <h3 className="text-sm font-medium mb-4 text-win-text-primary dark:text-win-dark-text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-win-text-secondary dark:text-win-dark-text-secondary">
        {label}
      </span>
      <span className="text-sm text-win-text-primary dark:text-win-dark-text-primary">
        {value}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-win-text-secondary dark:text-win-dark-text-secondary">
        {label}
      </span>
      <span className="text-win-text-primary dark:text-win-dark-text-primary">
        {value}
      </span>
    </div>
  );
}

function ThemeOption({
  label,
  icon,
  isSelected,
  onClick,
  bgClass,
  textClass = '',
}: {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  bgClass: string;
  textClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-lg',
        'border-2 transition-colors duration-100',
        isSelected
          ? 'border-win-accent'
          : 'border-win-border dark:border-win-dark-border hover:border-win-accent/50'
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-lg flex items-center justify-center',
          bgClass,
          textClass
        )}
      >
        {icon}
      </div>
      <span className="text-sm text-win-text-primary dark:text-win-dark-text-primary">
        {label}
      </span>
    </button>
  );
}

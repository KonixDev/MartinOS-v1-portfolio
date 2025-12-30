import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MartinOS - Windows 11 Web Clone',
  description: 'A fully-featured Windows 11 web clone built with Next.js, React, and TypeScript. Experience the Windows 11 desktop in your browser.',
  keywords: ['Windows 11', 'web clone', 'desktop', 'portfolio', 'Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'Martin' }],
  icons: {
    icon: '/icons/system/windows.svg',
    apple: '/icons/system/windows.svg',
  },
  openGraph: {
    title: 'MartinOS - Windows 11 Web Clone',
    description: 'Experience Windows 11 in your browser. A web-based recreation featuring window management, file explorer, and multiple apps.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MartinOS - Windows 11 Web Clone',
    description: 'Experience Windows 11 in your browser. A web-based recreation featuring window management, file explorer, and multiple apps.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0078d4',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}

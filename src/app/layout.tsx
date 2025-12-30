import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Windows 11 Web',
  description: 'A web-based Windows 11 clone built with Next.js',
  icons: {
    icon: '/icons/system/windows.svg',
  },
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

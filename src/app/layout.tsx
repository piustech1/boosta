import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boosta — Premium Social Growth Engine',
  description: 'High-performance SMM Panel powered by a zero-trust financial architecture and liquid glass UI.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Boosta SMM',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ADDFF1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:ital,wght@0,700;0,800;1,800&family=Plus+Jakarta+Sans:ital,wght@0,700;1,800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'AI감별사 - 진짜 혹은 AI?',
  description: 'AI 가짜 영상·사진을 함께 가려내요. 지금 12,847명이 함께하고 있어요.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'AI감별사 - 진짜 혹은 AI?',
    description: 'AI 가짜 영상·사진을 함께 가려내요. 지금 12,847명이 함께하고 있어요.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI감별사 - 진짜 혹은 AI?',
    description: 'AI 가짜 영상·사진을 함께 가려내요.',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    title: 'AI감별사',
    statusBarStyle: 'default',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1B3A6B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        <Providers>
          <main style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', position: 'relative' }}>
            {children}
            <BottomNav />
          </main>
        </Providers>
      </body>
    </html>
  );
}
